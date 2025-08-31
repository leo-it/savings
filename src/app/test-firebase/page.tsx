'use client';

import { useEffect, useState } from 'react';

import { auth } from '@/lib/firebase';

export default function TestFirebase() {
  const [status, setStatus] = useState<string>('Verificando...');
  const [error, setError] = useState<string>('');
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    testFirebase();
  }, []);

  const testFirebase = async () => {
    try {
      setStatus('Probando configuración de Firebase...');
      
      // Verificar que auth esté disponible
      if (!auth) {
        throw new Error('Firebase Auth no está disponible');
      }

      setStatus('Firebase Auth disponible ✅');
      
      // Verificar configuración
      const app = auth.app;
      if (app) {
        setConfig({
          name: app.name,
          options: app.options
        });
        setStatus('Firebase configurado correctamente ✅');
      } else {
        throw new Error('No se pudo obtener la configuración de la app');
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      setStatus('Error en la configuración ❌');
      console.error('Error en test Firebase:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          🔥 Test de Firebase
        </h1>
        
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Estado:</h2>
            <p className="text-blue-700">{status}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-red-900 mb-2">Error:</h2>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {config && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-900 mb-2">Configuración:</h2>
              <pre className="text-green-700 text-sm overflow-auto">
                {JSON.stringify(config, null, 2)}
              </pre>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Información del proyecto:</h2>
            <ul className="text-gray-700 space-y-1">
              <li>• Project ID: savings-app-widget</li>
              <li>• Auth Domain: savings-app-widget.firebaseapp.com</li>
              <li>• API Key: Configurada</li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={testFirebase}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Probar de nuevo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 