'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getSavingsDirect, updateSavingDirect, Saving } from '@/lib/firebase-firestore-direct';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function EditSaving() {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    type: 'general',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<Saving | null>(null);
  const router = useRouter();
  const params = useParams();
  const savingId = params.id as string;

  useEffect(() => {
    if (savingId) {
      fetchSaving();
    }
  }, [savingId]);

  const fetchSaving = async () => {
    try {
      const savings = await getSavingsDirect();
      const currentSaving = savings.find(s => s.id === savingId);
      
      if (!currentSaving) {
        setError('Ahorro no encontrado');
        return;
      }

      setSaving(currentSaving);
      setFormData({
        amount: currentSaving.amount.toString(),
        currency: currentSaving.currency,
        type: currentSaving.type,
        description: currentSaving.description || '',
        date: new Date(currentSaving.date).toISOString().split('T')[0]
      });
    } catch (error: any) {
      setError(`Error cargando ahorro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      console.log('✏️ Actualizando ahorro...');
      
      // Validar datos
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      // Actualizar ahorro en Firestore
      const updateData = {
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        type: formData.type,
        description: formData.description,
        date: new Date(formData.date)
      };

      console.log('📝 Datos de actualización:', updateData);
      
      await updateSavingDirect(savingId, updateData);
      
      console.log('✅ Ahorro actualizado exitosamente');

      // Redirigir al dashboard con mensaje de éxito
      router.push('/dashboard?tab=savings&message=Ahorro actualizado exitosamente');
    } catch (error: any) {
      console.error('❌ Error actualizando ahorro:', error);
      setError(error.message || 'Error al actualizar el ahorro');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  if (error && !saving) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
          <Link
            href="/dashboard?tab=savings"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Volver al Dashboard
          </Link>
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
                <Link href="/dashboard" className="text-2xl mr-4">
                  💰
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">
                  Editar Ahorro
                </h1>
              </div>
              
              <Link
                href="/dashboard?tab=savings"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Volver al Dashboard
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Editar Ahorro
              </h2>
              <p className="text-gray-600">
                Modifica los datos de tu ahorro
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Monto *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Currency */}
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda *
                </label>
                <select
                  id="currency"
                  name="currency"
                  required
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="USD">USD - Dólar Estadounidense</option>
                  <option value="ARS">ARS - Peso Argentino</option>
                  <option value="BTC">BTC - Bitcoin</option>
                  <option value="ETH">ETH - Ethereum</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="MXN">MXN - Peso Mexicano</option>
                  <option value="CLP">CLP - Peso Chileno</option>
                  <option value="COP">COP - Peso Colombiano</option>
                  <option value="PEN">PEN - Sol Peruano</option>
                </select>
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Ahorro *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="general">General</option>
                  <option value="emergency">Fondo de Emergencia</option>
                  <option value="vacation">Vacaciones</option>
                  <option value="house">Casa/Propiedad</option>
                  <option value="car">Automóvil</option>
                  <option value="education">Educación</option>
                  <option value="retirement">Jubilación</option>
                  <option value="investment">Inversión</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500"
                  placeholder="Describe el propósito de este ahorro..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link
                  href="/dashboard?tab=savings"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 