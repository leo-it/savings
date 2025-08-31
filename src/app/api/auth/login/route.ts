import { NextRequest, NextResponse } from 'next/server';
import { loginUser, getUserData } from '@/lib/firebase-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Iniciar sesión con Firebase
    const user = await loginUser(email, password);
    
    // Obtener datos adicionales del usuario desde Firestore
    const userData = await getUserData(user.uid);

    if (!userData) {
      return NextResponse.json(
        { error: 'Error obteniendo datos del usuario' },
        { status: 500 }
      );
    }

    // Retornar usuario autenticado
    return NextResponse.json({
      message: 'Login exitoso',
      user: userData,
      token: await user.getIdToken()
    });

  } catch (error: any) {
    console.error('Error en login:', error);
    
    // Manejar errores específicos de Firebase
    let errorMessage = 'Credenciales inválidas';
    if (error.message.includes('auth/user-not-found')) {
      errorMessage = 'Usuario no encontrado';
    } else if (error.message.includes('auth/wrong-password')) {
      errorMessage = 'Contraseña incorrecta';
    } else if (error.message.includes('auth/invalid-email')) {
      errorMessage = 'Email no válido';
    } else if (error.message.includes('auth/too-many-requests')) {
      errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    );
  }
} 