import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { createExpense, getExpenses } from '@/lib/firebase-firestore';

// Inicializar Firebase Admin si no está inicializado
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "savings-app-widget",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminAuth = getAuth();

// Función para verificar token de Firebase
async function verifyFirebaseToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    return null;
  }
}

// GET - Obtener gastos del usuario
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const decoded = await verifyFirebaseToken(authHeader);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    const expenses = await getExpenses(decoded.uid);
    return NextResponse.json(expenses);

  } catch (error) {
    console.error('Error obteniendo gastos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo gasto
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const decoded = await verifyFirebaseToken(authHeader);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    const { amount, currency, type, category, description, date } = await request.json();

    // Validaciones
    if (!amount || !currency || !type || !category) {
      return NextResponse.json(
        { error: 'Monto, moneda, tipo y categoría son requeridos' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'El monto debe ser mayor a 0' },
        { status: 400 }
      );
    }

    const expense = await createExpense({
      amount,
      currency,
      type,
      category,
      description,
      date: date ? new Date(date) : new Date(),
      userId: decoded.uid,
    });

    return NextResponse.json(
      { message: 'Gasto registrado exitosamente', expense },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creando gasto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 