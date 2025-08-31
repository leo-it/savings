import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { createSaving, getSavings } from '@/lib/firebase-firestore';

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

// GET - Obtener ahorros del usuario
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

    const savings = await getSavings(decoded.uid);
    return NextResponse.json(savings);

  } catch (error) {
    console.error('Error obteniendo ahorros:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo ahorro
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

    const { amount, currency, type, description, date } = await request.json();

    // Validaciones
    if (!amount || !currency || !type) {
      return NextResponse.json(
        { error: 'Monto, moneda y tipo son requeridos' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'El monto debe ser mayor a 0' },
        { status: 400 }
      );
    }

    const saving = await createSaving({
      amount,
      currency,
      type,
      description,
      date: date ? new Date(date) : new Date(),
      userId: decoded.uid,
    });

    return NextResponse.json(
      { message: 'Ahorro creado exitosamente', saving },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creando ahorro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 