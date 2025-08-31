import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Interfaces para los datos
export interface Saving {
  id?: string;
  amount: number;
  currency: string;
  type: string;
  description?: string;
  date: Date;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Expense {
  id?: string;
  amount: number;
  currency: string;
  type: string;
  category: string;
  description?: string;
  date: Date;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Investment {
  id?: string;
  name: string;
  amount: number;
  currency: string;
  type: string;
  description?: string;
  date: Date;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Funciones para Ahorros
export async function createSaving(savingData: Omit<Saving, 'id' | 'createdAt' | 'updatedAt'>): Promise<Saving> {
  try {
    const docRef = await addDoc(collection(db, 'savings'), {
      ...savingData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      id: docRef.id,
      ...savingData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error creando ahorro: ${errorMessage}`);
  }
}

export async function getSavings(userId: string): Promise<Saving[]> {
  try {
    const q = query(
      collection(db, 'savings'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Saving[];
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error obteniendo ahorros: ${errorMessage}`);
  }
}

export async function updateSaving(id: string, updates: Partial<Saving>): Promise<void> {
  try {
    const docRef = doc(db, 'savings', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error actualizando ahorro: ${errorMessage}`);
  }
}

export async function deleteSaving(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'savings', id));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error eliminando ahorro: ${errorMessage}`);
  }
}

// Funciones para Gastos
export async function createExpense(expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
  try {
    const docRef = await addDoc(collection(db, 'expenses'), {
      ...expenseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      id: docRef.id,
      ...expenseData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error creando gasto: ${errorMessage}`);
  }
}

export async function getExpenses(userId: string): Promise<Expense[]> {
  try {
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Expense[];
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error obteniendo gastos: ${errorMessage}`);
  }
}

export async function updateExpense(id: string, updates: Partial<Expense>): Promise<void> {
  try {
    const docRef = doc(db, 'expenses', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error actualizando gasto: ${errorMessage}`);
  }
}

export async function deleteExpense(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'expenses', id));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error eliminando gasto: ${errorMessage}`);
  }
}

// Funciones para Inversiones
export async function createInvestment(investmentData: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Investment> {
  try {
    const docRef = await addDoc(collection(db, 'investments'), {
      ...investmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      id: docRef.id,
      ...investmentData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error creando inversión: ${errorMessage}`);
  }
}

export async function getInvestments(userId: string): Promise<Investment[]> {
  try {
    const q = query(
      collection(db, 'investments'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Investment[];
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error obteniendo inversiones: ${errorMessage}`);
  }
}

export async function updateInvestment(id: string, updates: Partial<Investment>): Promise<void> {
  try {
    const docRef = doc(db, 'investments', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error actualizando inversión: ${errorMessage}`);
  }
}

export async function deleteInvestment(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'investments', id));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error eliminando inversión: ${errorMessage}`);
  }
} 