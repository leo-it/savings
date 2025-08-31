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
import { getCurrentUser } from './firebase-auth-direct';

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

// Funciones para Ahorros (versión directa)
export async function createSavingDirect(savingData: Omit<Saving, 'id' | 'createdAt' | 'updatedAt'>): Promise<Saving> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('💰 Creando ahorro en Firestore...');
    
    const docRef = await addDoc(collection(db, 'savings'), {
      ...savingData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Ahorro creado exitosamente:', docRef.id);

    return {
      id: docRef.id,
      ...savingData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error: any) {
    console.error('❌ Error creando ahorro:', error);
    throw new Error(`Error creando ahorro: ${error.message}`);
  }
}

export async function getSavingsDirect(): Promise<Saving[]> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('📊 Obteniendo ahorros desde Firestore...');
    
    // Consulta simple sin orderBy mientras se crea el índice
    const q = query(
      collection(db, 'savings'),
      where('userId', '==', user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    const savings = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Saving[];

    // Ordenar en el cliente mientras se crea el índice
    savings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log(`✅ ${savings.length} ahorros obtenidos`);
    return savings;
  } catch (error: any) {
    console.error('❌ Error obteniendo ahorros:', error);
    throw new Error(`Error obteniendo ahorros: ${error.message}`);
  }
}

// Funciones para Gastos (versión directa)
export async function createExpenseDirect(expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('💸 Creando gasto en Firestore...');
    
    const docRef = await addDoc(collection(db, 'expenses'), {
      ...expenseData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Gasto creado exitosamente:', docRef.id);

    return {
      id: docRef.id,
      ...expenseData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error: any) {
    console.error('❌ Error creando gasto:', error);
    throw new Error(`Error creando gasto: ${error.message}`);
  }
}

export async function getExpensesDirect(): Promise<Expense[]> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('📊 Obteniendo gastos desde Firestore...');
    
    // Consulta simple sin orderBy mientras se crea el índice
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    const expenses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Expense[];

    // Ordenar en el cliente mientras se crea el índice
    expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log(`✅ ${expenses.length} gastos obtenidos`);
    return expenses;
  } catch (error: any) {
    console.error('❌ Error obteniendo gastos:', error);
    throw new Error(`Error obteniendo gastos: ${error.message}`);
  }
}

// Funciones para Inversiones (versión directa)
export async function createInvestmentDirect(investmentData: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Investment> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('📈 Creando inversión en Firestore...');
    
    const docRef = await addDoc(collection(db, 'investments'), {
      ...investmentData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Inversión creada exitosamente:', docRef.id);

    return {
      id: docRef.id,
      ...investmentData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error: any) {
    console.error('❌ Error creando inversión:', error);
    throw new Error(`Error creando inversión: ${error.message}`);
  }
}

export async function getInvestmentsDirect(): Promise<Investment[]> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('📊 Obteniendo inversiones desde Firestore...');
    
    // Consulta simple sin orderBy mientras se crea el índice
    const q = query(
      collection(db, 'investments'),
      where('userId', '==', user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    const investments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Investment[];

    // Ordenar en el cliente mientras se crea el índice
    investments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log(`✅ ${investments.length} inversiones obtenidas`);
    return investments;
  } catch (error: any) {
    console.error('❌ Error obteniendo inversiones:', error);
    throw new Error(`Error obteniendo inversiones: ${error.message}`);
  }
} 

// Funciones para editar y eliminar Ahorros
export async function updateSavingDirect(savingId: string, savingData: Partial<Saving>): Promise<void> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('✏️ Actualizando ahorro en Firestore...');
    
    const savingRef = doc(db, 'savings', savingId);
    await updateDoc(savingRef, {
      ...savingData,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Ahorro actualizado exitosamente');
  } catch (error: any) {
    console.error('❌ Error actualizando ahorro:', error);
    throw new Error(`Error actualizando ahorro: ${error.message}`);
  }
}

export async function deleteSavingDirect(savingId: string): Promise<void> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('🗑️ Eliminando ahorro de Firestore...');
    
    const savingRef = doc(db, 'savings', savingId);
    await deleteDoc(savingRef);

    console.log('✅ Ahorro eliminado exitosamente');
  } catch (error: any) {
    console.error('❌ Error eliminando ahorro:', error);
    throw new Error(`Error eliminando ahorro: ${error.message}`);
  }
}

// Funciones para editar y eliminar Gastos
export async function updateExpenseDirect(expenseId: string, expenseData: Partial<Expense>): Promise<void> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('✏️ Actualizando gasto en Firestore...');
    
    const expenseRef = doc(db, 'expenses', expenseId);
    await updateDoc(expenseRef, {
      ...expenseData,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Gasto actualizado exitosamente');
  } catch (error: any) {
    console.error('❌ Error actualizando gasto:', error);
    throw new Error(`Error actualizando gasto: ${error.message}`);
  }
}

export async function deleteExpenseDirect(expenseId: string): Promise<void> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('🗑️ Eliminando gasto de Firestore...');
    
    const expenseRef = doc(db, 'expenses', expenseId);
    await deleteDoc(expenseRef);

    console.log('✅ Gasto eliminado exitosamente');
  } catch (error: any) {
    console.error('❌ Error eliminando gasto:', error);
    throw new Error(`Error eliminando gasto: ${error.message}`);
  }
}

// Funciones para editar y eliminar Inversiones
export async function updateInvestmentDirect(investmentId: string, investmentData: Partial<Investment>): Promise<void> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('✏️ Actualizando inversión en Firestore...');
    
    const investmentRef = doc(db, 'investments', investmentId);
    await updateDoc(investmentRef, {
      ...investmentData,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Inversión actualizada exitosamente');
  } catch (error: any) {
    console.error('❌ Error actualizando inversión:', error);
    throw new Error(`Error actualizando inversión: ${error.message}`);
  }
}

export async function deleteInvestmentDirect(investmentId: string): Promise<void> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('🗑️ Eliminando inversión de Firestore...');
    
    const investmentRef = doc(db, 'investments', investmentId);
    await deleteDoc(investmentRef);

    console.log('✅ Inversión eliminada exitosamente');
  } catch (error: any) {
    console.error('❌ Error eliminando inversión:', error);
    throw new Error(`Error eliminando inversión: ${error.message}`);
  }
} 