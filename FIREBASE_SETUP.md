# Configuración de Firebase para Mi App de Ahorros

## 🚀 Pasos para configurar Firebase

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Dale un nombre a tu proyecto (ej: "mi-app-ahorros")
4. Puedes desactivar Google Analytics si no lo necesitas
5. Haz clic en "Crear proyecto"

### 2. Habilitar Authentication

1. En el panel izquierdo, haz clic en "Authentication"
2. Haz clic en "Comenzar"
3. En la pestaña "Sign-in method", habilita "Correo electrónico/contraseña"
4. Haz clic en "Guardar"

### 3. Crear base de datos Firestore

1. En el panel izquierdo, haz clic en "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (puedes cambiar esto después)
4. Selecciona la ubicación más cercana a tus usuarios
5. Haz clic en "Habilitar"

### 4. Configurar reglas de Firestore

En la pestaña "Reglas", reemplaza las reglas existentes con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Los usuarios solo pueden leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /savings/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    match /expenses/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    match /investments/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### 5. Obtener configuración de la app web

1. En la página principal del proyecto, haz clic en el ícono de web (</>)
2. Dale un nombre a tu app (ej: "mi-app-ahorros-web")
3. Haz clic en "Registrar app"
4. Copia la configuración que aparece

### 6. Crear cuenta de servicio para Firebase Admin

1. En la configuración del proyecto (ícono de engranaje), ve a "Cuentas de servicio"
2. Haz clic en "Generar nueva clave privada"
3. Descarga el archivo JSON
4. **IMPORTANTE**: Nunca subas este archivo a tu repositorio

### 7. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz de tu proyecto con:

```bash
# Firebase Config (cliente)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Firebase Admin (servidor)
FIREBASE_PROJECT_ID=tu_proyecto_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu_proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu_clave_privada_aqui\n-----END PRIVATE KEY-----\n"
```

### 8. Estructura de la base de datos

Firestore creará automáticamente las siguientes colecciones:

- `users`: Información de usuarios
- `savings`: Registros de ahorros
- `expenses`: Registros de gastos
- `investments`: Registros de inversiones

### 9. Probar la aplicación

1. Ejecuta `npm run dev`
2. Ve a la página de registro
3. Crea una cuenta
4. Inicia sesión
5. Verifica que puedas crear ahorros y gastos

## 🔒 Seguridad

- Las reglas de Firestore aseguran que los usuarios solo puedan acceder a sus propios datos
- Firebase Auth maneja la autenticación de forma segura
- Las contraseñas se almacenan de forma segura en Firebase

## 📱 Características implementadas

- ✅ Autenticación con email/contraseña
- ✅ Registro de usuarios
- ✅ Gestión de ahorros
- ✅ Gestión de gastos
- ✅ Gestión de inversiones
- ✅ Protección de rutas
- ✅ Contexto de autenticación
- ✅ Manejo de errores específicos de Firebase

## 🚨 Solución de problemas comunes

### Error: "Firebase: Error (auth/invalid-api-key)"
- Verifica que tu API key esté correctamente configurada en `.env.local`

### Error: "Firebase: Error (auth/operation-not-allowed)"
- Asegúrate de haber habilitado la autenticación por email/contraseña en Firebase Console

### Error: "Firebase: Error (auth/network-request-failed)"
- Verifica tu conexión a internet
- Asegúrate de que las reglas de Firestore permitan las operaciones

### Error: "Firebase: Error (auth/too-many-requests)"
- Espera unos minutos antes de intentar nuevamente
- Considera implementar rate limiting en tu aplicación

## 📚 Recursos adicionales

- [Documentación oficial de Firebase](https://firebase.google.com/docs)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin) 