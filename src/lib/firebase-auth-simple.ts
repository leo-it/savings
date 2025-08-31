import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
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

// Registrar nuevo usuario (versión simplificada)
export async function registerUserSimple(name: string, email: string, password: string): Promise<UserData> {
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Actualizar perfil con el nombre
    await updateProfile(user, { displayName: name });

    return {
      id: user.uid,
      name,
      email,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error: any) {
    console.error('Error en registro:', error);
    throw error;
  }
}

// Iniciar sesión
export async function loginUserSimple(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error en login:', error);
    throw error;
  }
}

// Cerrar sesión
export async function logoutUserSimple(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error en logout:', error);
    throw error;
  }
} 