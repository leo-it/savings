# Configuración Firebase para savings-app-widget

## 🔥 Configuración del Cliente (Frontend)

Tu configuración de Firebase ya está lista en `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyDEYApj_fR893ERtdvl9sQIfdzLBpNZIDc",
  authDomain: "savings-app-widget.firebaseapp.com",
  projectId: "savings-app-widget",
  storageBucket: "savings-app-widget.firebasestorage.app",
  messagingSenderId: "924625588531",
  appId: "1:924625588531:web:20a8a45a8ac8519563ae46"
};
```

## ⚙️ Configuración del Servidor (Backend)

Crea un archivo `.env.local` en la raíz de tu proyecto con:

```bash
# Firebase Admin (para el servidor)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@savings-app-widget.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu_clave_privada_aqui\n-----END PRIVATE KEY-----\n"
```

## 🔑 Obtener credenciales de Firebase Admin

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `savings-app-widget`
3. Ve a Configuración del proyecto (ícono de engranaje)
4. Pestaña "Cuentas de servicio"
5. Haz clic en "Generar nueva clave privada"
6. Descarga el archivo JSON
7. Copia el `client_email` y `private_key` al archivo `.env.local`

## 🚀 Próximos pasos

1. **Habilitar Authentication**:
   - Ve a Authentication > Sign-in method
   - Habilita "Correo electrónico/contraseña"

2. **Crear Firestore Database**:
   - Ve a Firestore Database
   - Crea la base de datos en modo de prueba

3. **Configurar reglas de seguridad**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
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

4. **Probar la aplicación**:
   ```bash
   npm run dev
   ```

## ✅ Estado actual

- ✅ Configuración de Firebase cliente
- ✅ Configuración de Firebase Admin en las APIs
- ✅ Estructura de la aplicación migrada
- ⏳ Pendiente: Configurar credenciales de Admin
- ⏳ Pendiente: Habilitar servicios en Firebase Console 