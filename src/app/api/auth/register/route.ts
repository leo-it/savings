import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/firebase-auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validaciones básicas
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Crear usuario con Firebase
    const user = await registerUser(name, email, password);

    return NextResponse.json(
      { message: 'Usuario creado exitosamente', user },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error en registro:', error);
    
    // Manejar errores específicos de Firebase
    let errorMessage = 'Error interno del servidor';
    if (error.message.includes('auth/email-already-in-use')) {
      errorMessage = 'El email ya está registrado';
    } else if (error.message.includes('auth/weak-password')) {
      errorMessage = 'La contraseña es demasiado débil';
    } else if (error.message.includes('auth/invalid-email')) {
      errorMessage = 'El email no es válido';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
} 