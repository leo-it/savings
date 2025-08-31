import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';

import { auth } from './firebase';

export interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Registrar nuevo usuario (versión directa)
export async function registerUserDirect(name: string, email: string, password: string): Promise<UserData> {
  try {
    console.log('🔥 Iniciando registro con Firebase Auth...');
    
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Usuario creado en Firebase Auth:', user.uid);

    // Actualizar perfil con el nombre
    await updateProfile(user, { displayName: name });
    console.log('✅ Perfil actualizado con nombre:', name);

    return {
      id: user.uid,
      name,
      email,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error: unknown) {
    console.error('❌ Error en registro directo:', error);
    
    // Manejar errores específicos
    if (error instanceof Error) {
      if (error.message.includes('auth/email-already-in-use')) {
        throw new Error('Este email ya está registrado. Por favor, usa un email diferente o inicia sesión.');
      } else if (error.message.includes('auth/weak-password')) {
        throw new Error('La contraseña es demasiado débil. Debe tener al menos 6 caracteres.');
      } else if (error.message.includes('auth/invalid-email')) {
        throw new Error('El formato del email no es válido.');
      } else if (error.message.includes('auth/operation-not-allowed')) {
        throw new Error('El registro por email/contraseña no está habilitado en este proyecto.');
      } else {
        throw new Error(`Error en el registro: ${error.message}`);
      }
    } else {
      throw new Error('Error desconocido en el registro');
    }
  }
}

// Iniciar sesión (versión directa)
export async function loginUserDirect(email: string, password: string): Promise<User> {
  try {
    console.log('🔥 Iniciando login con Firebase Auth...');
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Login exitoso:', user.uid);
    return user;
  } catch (error: unknown) {
    console.error('❌ Error en login directo:', error);
    
    // Manejar errores específicos
    if (error instanceof Error) {
      if (error.message.includes('auth/user-not-found')) {
        throw new Error('Usuario no encontrado. Verifica tu email o regístrate.');
      } else if (error.message.includes('auth/wrong-password')) {
        throw new Error('Contraseña incorrecta.');
      } else if (error.message.includes('auth/invalid-email')) {
        throw new Error('El formato del email no es válido.');
      } else if (error.message.includes('auth/too-many-requests')) {
        throw new Error('Demasiados intentos fallidos. Intenta más tarde.');
      } else {
        throw new Error(`Error en el login: ${error.message}`);
      }
    } else {
      throw new Error('Error desconocido en el login');
    }
  }
}

// Cerrar sesión (versión directa)
export async function logoutUserDirect(): Promise<void> {
  try {
    console.log('🔥 Cerrando sesión...');
    await signOut(auth);
    console.log('✅ Sesión cerrada exitosamente');
  } catch (error: unknown) {
    console.error('❌ Error cerrando sesión:', error);
    throw error;
  }
}

// Verificar estado de autenticación
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// Escuchar cambios en autenticación
export function onAuthStateChanged(callback: (user: User | null) => void) {
  return auth.onAuthStateChanged(callback);
} 