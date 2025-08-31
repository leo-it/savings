import { NextRequest, NextResponse } from 'next/server';

// Verificar si las credenciales de Firebase Admin están disponibles
const hasFirebaseAdminCredentials = process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY;

// Solo importar Firebase Admin si las credenciales están disponibles
let adminAuth: any = null;
let createInvestment: any = null;
let getInvestments: any = null;

if (hasFirebaseAdminCredentials) {
  try {
    const { getAuth } = require('firebase-admin/auth');
    const { initializeApp, getApps, cert } = require('firebase-admin/app');
    const firestoreFunctions = require('@/lib/firebase-firestore');
    
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

    adminAuth = getAuth();
    createInvestment = firestoreFunctions.createInvestment;
    getInvestments = firestoreFunctions.getInvestments;
  } catch (error) {
    console.warn('Firebase Admin no disponible:', error);
  }
}

// Función para verificar token de Firebase
async function verifyFirebaseToken(authHeader: string | null) {
  if (!adminAuth || !authHeader || !authHeader.startsWith('Bearer ')) {
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

// GET - Obtener inversiones del usuario
export async function GET(request: NextRequest) {
  if (!hasFirebaseAdminCredentials) {
    return NextResponse.json(
      { error: 'Firebase Admin no configurado' },
      { status: 503 }
    );
  }

  try {
    const authHeader = request.headers.get('authorization');
    const decoded = await verifyFirebaseToken(authHeader);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    const investments = await getInvestments(decoded.uid);
    return NextResponse.json(investments);

  } catch (error) {
    console.error('Error obteniendo inversiones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva inversión
export async function POST(request: NextRequest) {
  if (!hasFirebaseAdminCredentials) {
    return NextResponse.json(
      { error: 'Firebase Admin no configurado' },
      { status: 503 }
    );
  }

  try {
    const authHeader = request.headers.get('authorization');
    const decoded = await verifyFirebaseToken(authHeader);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    const { name, amount, currency, type, description, date } = await request.json();

    // Validaciones
    if (!name || !amount || !currency || !type) {
      return NextResponse.json(
        { error: 'Nombre, monto, moneda y tipo son requeridos' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'El monto debe ser mayor a 0' },
        { status: 400 }
      );
    }

    const investment = await createInvestment({
      name,
      amount,
      currency,
      type,
      description,
      date: date ? new Date(date) : new Date(),
      userId: decoded.uid,
    });

    return NextResponse.json(
      { message: 'Inversión creada exitosamente', investment },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creando inversión:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 