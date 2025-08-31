'use client';

import Link from 'next/link';
import { registerUserDirect } from '@/lib/firebase-auth-direct';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🚀 Iniciando proceso de registro...');
      console.log('📝 Datos del formulario:', { name: formData.name, email: formData.email });
      
      // Registro directo con Firebase Auth
      const userData = await registerUserDirect(formData.name, formData.email, formData.password);
      
      console.log('✅ Usuario registrado exitosamente:', userData);
      
      // Registro exitoso, redirigir al login
      router.push('/auth/login?message=Registro exitoso! Ahora puedes iniciar sesión.');
    } catch (err: unknown) {
      console.error('❌ Error completo:', err);
      console.error('❌ Error code:', (err as any).code);
      console.error('❌ Error message:', (err as any).message);
      console.error('❌ Error stack:', (err as any).stack);
      
      // Manejar errores específicos de Firebase
      let errorMessage = 'Error en el registro';
      
      if ((err as any).code === 'auth/email-already-in-use') {
        errorMessage = 'El email ya está registrado';
      } else if ((err as any).code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil';
      } else if ((err as any).code === 'auth/invalid-email') {
        errorMessage = 'El email no es válido';
      } else if ((err as any).code === 'auth/operation-not-allowed') {
        errorMessage = 'El registro por email/contraseña no está habilitado';
      } else if ((err as any).code === 'auth/network-request-failed') {
        errorMessage = 'Error de conexión. Verifica tu internet';
      } else if ((err as any).code === 'auth/invalid-api-key') {
        errorMessage = 'Error de configuración de Firebase';
      } else if ((err as any).code === 'auth/app-not-authorized') {
        errorMessage = 'Aplicación no autorizada';
      } else if ((err as any).code === 'auth/configuration-not-found') {
        errorMessage = 'Configuración de Firebase no encontrada';
      } else {
        errorMessage = `Error: ${(err as any).message || (err as any).code || 'Desconocido'}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="text-4xl mb-4 inline-block">
            💰
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Crear cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Comienza a gestionar tus ahorros hoy mismo
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Repite tu contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>

        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
} 