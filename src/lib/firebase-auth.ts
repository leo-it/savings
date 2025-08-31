import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Registrar nuevo usuario
export async function registerUser(name: string, email: string, password: string): Promise<UserData> {
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Actualizar perfil con el nombre
    await updateProfile(user, { displayName: name });

    // Crear documento de usuario en Firestore
    const userData: Omit<UserData, 'id'> = {
      name,
      email,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return {
      id: user.uid,
      ...userData
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(errorMessage);
  }
}

// Iniciar sesión
export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(errorMessage);
  }
}

// Cerrar sesión
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(errorMessage);
  }
}

// Obtener datos del usuario desde Firestore
export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      } as UserData;
    }
    return null;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(errorMessage);
  }
} 