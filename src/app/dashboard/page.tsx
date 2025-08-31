'use client';

import {
  Expense,
  Saving,
  deleteExpenseDirect,
  deleteSavingDirect,
  getExpensesDirect,
  getSavingsDirect
} from '@/lib/firebase-firestore-direct';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { logoutUserDirect } from '@/lib/firebase-auth-direct';
import { useAuth } from '@/hooks/useAuth';

function DashboardContent() {
  const { user, userData } = useAuth();
  const [savings, setSavings] = useState<Saving[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'savings' | 'expenses'>('overview');
  const [message, setMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    // Verificar parámetros de URL
    const tabParam = searchParams.get('tab');
    const messageParam = searchParams.get('message');
    
    if (tabParam && ['overview', 'savings', 'expenses'].includes(tabParam)) {
      setActiveTab(tabParam as 'overview' | 'savings' | 'expenses');
    }
    
    if (messageParam) {
      setMessage(messageParam);
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setMessage(''), 5000);
    }
  }, [searchParams]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      console.log('🔄 Obteniendo datos del dashboard...');
      const [savingsData, expensesData] = await Promise.all([
        getSavingsDirect(),
        getExpensesDirect()
      ]);

      setSavings(savingsData);
      setExpenses(expensesData);
      console.log('✅ Datos del dashboard obtenidos exitosamente');
    } catch (error) {
      console.error('❌ Error obteniendo datos del dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUserDirect();
      router.push('/');
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  const handleDeleteSaving = async (savingId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este ahorro?')) return;
    
    setIsDeleting(savingId);
    try {
      await deleteSavingDirect(savingId);
      setSavings(prev => prev.filter(s => s.id !== savingId));
      setMessage('Ahorro eliminado exitosamente');
      setTimeout(() => setMessage(''), 5000);
    } catch (error: any) {
      setMessage(`Error eliminando ahorro: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este gasto?')) return;
    
    setIsDeleting(expenseId);
    try {
      await deleteExpenseDirect(expenseId);
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
      setMessage('Gasto eliminado exitosamente');
      setTimeout(() => setMessage(''), 5000);
    } catch (error: any) {
      setMessage(`Error eliminando gasto: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsDeleting(null);
    }
  };

  const getTotalSavingsByCurrency = () => {
    const totals: { [key: string]: number } = {};
    
    savings.forEach(saving => {
      if (totals[saving.currency]) {
        totals[saving.currency] += saving.amount;
      } else {
        totals[saving.currency] = saving.amount;
      }
    });
    
    return totals;
  };

  const getAllCurrencies = () => {
    const currencies = new Set([
      ...savings.map(s => s.currency),
      ...expenses.map(e => e.currency)
    ]);
    return Array.from(currencies);
  };

  const getTotalExpensesByCurrency = () => {
    const totals: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      if (totals[expense.currency]) {
        totals[expense.currency] += expense.amount;
      } else {
        totals[expense.currency] = expense.amount;
      }
    });
    
    return totals;
  };

  const formatCurrency = (amount: number, currency: string) => {
    // Para criptomonedas y monedas que no soporta Intl.NumberFormat
    if (['BTC', 'ETH'].includes(currency)) {
      return `${amount.toFixed(8)} ${currency}`;
    }
    
    // Para monedas tradicionales
    try {
      const formatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
      });
      return formatter.format(amount);
    } catch (error) {
      // Fallback si la moneda no es válida para Intl.NumberFormat
      return `${amount.toFixed(2)} ${currency}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl mr-4">
                  💰
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">
                  Dashboard
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Hola, {userData?.name || user?.displayName || 'Usuario'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Success Message */}
        {message && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('savings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'savings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ahorros
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'expenses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gastos
            </button>
          </nav>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="space-y-6">
                {/* Total por Moneda */}
                {getAllCurrencies().length > 0 ? (
                  getAllCurrencies().map(currency => {
                    const savingsTotal = getTotalSavingsByCurrency()[currency] || 0;
                    const expensesTotal = getTotalExpensesByCurrency()[currency] || 0;
                    const availableBalance = savingsTotal - expensesTotal;
                    
                    return (
                      <div key={currency} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Resumen en {currency}
                          </h3>
                          <span className="text-2xl">💰</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-600">Ahorros Totales</p>
                            <p className="text-xl font-bold text-blue-900">
                              {formatCurrency(savingsTotal, currency)}
                            </p>
                          </div>
                          
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <p className="text-sm font-medium text-red-600">Gastos Totales</p>
                            <p className="text-xl font-bold text-red-900">
                              {formatCurrency(expensesTotal, currency)}
                            </p>
                          </div>
                          
                          <div className={`text-center p-3 rounded-lg ${
                            availableBalance >= 0 ? 'bg-green-50' : 'bg-red-50'
                          }`}>
                            <p className={`text-sm font-medium ${
                              availableBalance >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {availableBalance >= 0 ? 'Saldo Disponible' : 'Saldo Negativo'}
                            </p>
                            <p className={`text-xl font-bold ${
                              availableBalance >= 0 ? 'text-green-900' : 'text-red-900'
                            }`}>
                              {formatCurrency(Math.abs(availableBalance), currency)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <span className="text-4xl mb-4 block">💡</span>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos financieros</h3>
                    <p className="text-gray-500">
                      Comienza agregando tus primeros ahorros para ver un resumen aquí
                    </p>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
                </div>
                <div className="p-6">
                  {savings.length === 0 && expenses.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No hay actividad reciente. ¡Comienza agregando tus primeros ahorros o registrando gastos!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {[...savings.slice(0, 5), ...expenses.slice(0, 5)]
                        .sort((a, b) => {
                          const dateA = new Date(a.date);
                          const dateB = new Date(b.date);
                          return dateB.getTime() - dateA.getTime();
                        })
                        .slice(0, 5)
                        .map((item, index) => (
                          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center">
                              <span className="text-lg mr-3">
                                {item.hasOwnProperty('category') ? '💸' : '💵'}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.hasOwnProperty('category') ? `Gasto - ${item.type}` : `Ahorro - ${item.type}`}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(item.date).toLocaleDateString('es-MX')}
                                </p>
                              </div>
                            </div>
                            <span className={`font-semibold ${
                              item.hasOwnProperty('category') ? 'text-red-900' : 'text-gray-900'
                            }`}>
                              {formatCurrency(item.amount, item.currency)}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'savings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Mis Ahorros</h2>
                <Link
                  href="/dashboard/savings/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Nuevo Ahorro
                </Link>
              </div>

              {savings.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <span className="text-4xl mb-4 block">💵</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes ahorros aún</h3>
                  <p className="text-gray-500 mb-4">Comienza a ahorrar agregando tu primer monto</p>
                  <Link
                    href="/dashboard/savings/new"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Agregar Ahorro
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descripción
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {savings.map((saving) => (
                          <tr key={saving.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(saving.date).toLocaleDateString('es-MX')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {saving.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {saving.description || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(saving.amount, saving.currency)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Link
                                  href={`/dashboard/savings/edit/${saving.id}`}
                                  className="text-blue-600 hover:text-blue-900 transition-colors"
                                >
                                  ✏️ Editar
                                </Link>
                                <button
                                  onClick={() => saving.id && handleDeleteSaving(saving.id)}
                                  disabled={isDeleting === saving.id}
                                  className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                                >
                                  {isDeleting === saving.id ? '🗑️...' : '🗑️ Eliminar'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Mis Gastos</h2>
                <Link
                  href="/dashboard/expenses/new"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  + Nuevo Gasto
                </Link>
              </div>

              {expenses.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <span className="text-4xl mb-4 block">💸</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes gastos registrados</h3>
                  <p className="text-gray-500 mb-4">Comienza a registrar tus gastos para controlar mejor tus finanzas</p>
                  <Link
                    href="/dashboard/expenses/new"
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Registrar Gasto
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoría
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descripción
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {expenses.map((expense) => (
                          <tr key={expense.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(expense.date).toLocaleDateString('es-MX')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {expense.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                expense.category === 'essential' ? 'bg-red-100 text-red-800' :
                                expense.category === 'discretionary' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {expense.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {expense.description || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-900">
                              {formatCurrency(expense.amount, expense.currency)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Link
                                  href={`/dashboard/expenses/edit/${expense.id}`}
                                  className="text-blue-600 hover:text-blue-900 transition-colors"
                                >
                                  ✏️ Editar
                                </Link>
                                <button
                                  onClick={() => expense.id && handleDeleteExpense(expense.id)}
                                  disabled={isDeleting === expense.id}
                                  className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                                >
                                  {isDeleting === expense.id ? '🗑️...' : '🗑️ Eliminar'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <DashboardContent />
    </Suspense>
  );
} 