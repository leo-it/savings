'use client';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { auth } from '@/lib/firebase';
import { useState } from 'react';

export default function DebugFirebase() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('Test User');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFirebaseAuth = async () => {
    setStatus('Probando Firebase Auth...');
    setError('');
    setLogs([]);

    try {
      addLog('🚀 Iniciando test de Firebase Auth...');
      
      // Verificar configuración
      addLog(`📋 Configuración del proyecto: ${auth.app.options.projectId}`);
      addLog(`🔑 API Key configurada: ${auth.app.options.apiKey ? '✅' : '❌'}`);
      addLog(`🌐 Auth Domain: ${auth.app.options.authDomain}`);
      
      // Verificar que auth esté disponible
      if (!auth) {
        throw new Error('Firebase Auth no está disponible');
      }
      addLog('✅ Firebase Auth disponible');

      // Verificar configuración de la app
      addLog('🔧 Verificando configuración de la app...');
      const appConfig = auth.app.options;
      addLog(`📱 App Name: ${appConfig.appId || 'No configurado'}`);
      addLog(`🏗️ Project ID: ${appConfig.projectId || 'No configurado'}`);
      addLog(`🔑 API Key: ${appConfig.apiKey ? 'Configurada' : 'Faltante'}`);
      
      // Intentar crear usuario
      addLog('👤 Intentando crear usuario...');
      addLog(`📧 Email: ${email}`);
      addLog(`🔒 Password: ${password.length} caracteres`);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      addLog('✅ Usuario creado exitosamente');
      
      // Actualizar perfil
      addLog('📝 Actualizando perfil...');
      await updateProfile(userCredential.user, { displayName: name });
      addLog('✅ Perfil actualizado');
      
      addLog(`🎉 Usuario completo: ${userCredential.user.uid}`);
      setStatus('✅ Test completado exitosamente');
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        addLog(`❌ Error: ${err.message}`);
        setError(err.message);
      } else {
        addLog(`❌ Error: ${String(err)}`);
        setError(String(err));
      }
      
      // Para acceder a propiedades específicas de Firebase Auth, necesitamos hacer type assertion
      const firebaseError = err as any;
      addLog(`🔍 Error code: ${firebaseError.code}`);
      addLog(`📚 Error stack: ${firebaseError.stack}`);
      
      setStatus('❌ Test falló');
      
      // Análisis detallado del error
      if (firebaseError.code === 'auth/operation-not-allowed') {
        addLog('💡 SOLUCIÓN CRÍTICA: Habilita "Correo electrónico/contraseña" en Firebase Console');
        addLog('📍 Ve a: Firebase Console > Authentication > Sign-in method');
        addLog('📍 Habilita el toggle para "Correo electrónico/contraseña"');
      } else if (firebaseError.code === 'auth/invalid-api-key') {
        addLog('💡 SOLUCIÓN: Verifica tu API key en Firebase Console');
      } else if (firebaseError.code === 'auth/app-not-authorized') {
        addLog('💡 SOLUCIÓN: Verifica que tu app esté autorizada');
      } else if (firebaseError.code === 'auth/network-request-failed') {
        addLog('💡 SOLUCIÓN: Verifica tu conexión a internet');
      } else if (firebaseError.code === 'auth/configuration-not-found') {
        addLog('💡 SOLUCIÓN: Firebase Auth no está habilitado en tu proyecto');
        addLog('📍 Ve a: Firebase Console > Authentication > Comenzar');
      } else if (firebaseError.code === 'auth/unauthorized-domain') {
        addLog('💡 SOLUCIÓN: Tu dominio no está autorizado');
        addLog('📍 Ve a: Firebase Console > Authentication > Settings > Authorized domains');
      }
      
      // Información adicional para debugging
      addLog('🔍 INFORMACIÓN ADICIONAL:');
      addLog(`📍 Project ID: ${auth.app.options.projectId}`);
      addLog(`📍 Auth Domain: ${auth.app.options.authDomain}`);
      addLog(`📍 API Key: ${auth.app.options.apiKey ? 'Configurada' : 'Faltante'}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setStatus('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          🔍 Debug de Firebase Auth
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel de Control */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Panel de Control</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de prueba:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="test@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña de prueba:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="123456"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de prueba:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Test User"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={testFirebaseAuth}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Probar Firebase Auth
                </button>
                
                <button
                  onClick={clearLogs}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Estado:</h3>
              <p className="text-blue-700">{status || 'Listo para probar'}</p>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">Error:</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
          
          {/* Logs */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Logs de Debug</h2>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">Los logs aparecerán aquí cuando ejecutes el test...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Información del Proyecto */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Proyecto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Project ID</h3>
              <p className="text-gray-600">savings-app-widget</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Auth Domain</h3>
              <p className="text-gray-600">savings-app-widget.firebaseapp.com</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">API Key</h3>
              <p className="text-gray-600">Configurada ✅</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-900 mb-2">⚠️ Verificación Requerida:</h3>
            <p className="text-yellow-700">
              Asegúrate de que <strong>Firebase Authentication</strong> esté habilitado en tu proyecto 
              y que <strong>"Correo electrónico/contraseña"</strong> esté habilitado como método de inicio de sesión.
            </p>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">✅ Firestore Configurado:</h3>
            <p className="text-green-700">
              Tu base de datos Firestore está configurada con reglas temporales que permiten todas las operaciones.
              El problema está en Firebase Authentication, no en Firestore.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 