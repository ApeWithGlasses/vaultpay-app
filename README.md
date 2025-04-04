# VaultPay App

VaultPay es una aplicación móvil desarrollada con React Native y Expo que permite gestionar cuentas bancarias y realizar operaciones básicas como consultar saldos, actualizar balances y administrar múltiples cuentas.

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI
- Un editor de código (VS Code recomendado)
- Un dispositivo móvil con Expo Go instalado o un emulador Android/iOS

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/ApeWithGlasses/vaultpay-app
cd vaultpay-app
```

2. Instala las dependencias:
```bash
npm run install
# o si usas yarn
yarn install
```

3. Configura las variables de entorno:
   - Abre el archivo `config/env.js`
   - Ejecutar ipconfig en una ventana de comandos y obtener la dirección local.
   - Ajusta la URL del API según tu entorno:
   - Reemplazar localhost por la dirección local de la máquina.
```javascript
// Configuración base de la API
export const API_URL = 'http://localhost:8080/api';

// Endpoints disponibles
export const ENDPOINTS = {
    LOGIN: `${API_URL}/auth/login`,           // Autenticación de usuarios
    REGISTER: `${API_URL}/users/register`,    // Registro de nuevos usuarios
    GET_USER_BY_EMAIL: `${API_URL}/users/email`, // Buscar usuario por email
    GET_USER_ACCOUNTS: `${API_URL}/accounts`, // Obtener cuentas del usuario
    UPDATE_ACCOUNT_BALANCE: `${API_URL}/accounts/update`, // Actualizar balance
    DELETE_ACCOUNT: `${API_URL}/accounts/delete`, // Eliminar cuenta
    REGISTER_ACCOUNT: `${API_URL}/accounts/register`, // Registrar nueva cuenta
    UPDATE_USER: `${API_URL}/users`,          // Actualizar información del usuario
};
```

   - Asegúrate de que la URL base (`API_URL`) coincida con la dirección de tu servidor backend
   - Todos los endpoints están configurados relativos a esta URL base

## Ejecución del Proyecto

1. Inicia el servidor de desarrollo:
```bash
npm run start
# o
yarn start
```

2. Opciones para ejecutar la aplicación:
   - Escanea el código QR con la app Expo Go en tu dispositivo móvil
   - Presiona 'a' para abrir en emulador Android
   - Presiona 'i' para abrir en emulador iOS (solo en macOS)

## Estructura del Proyecto

```
vaultpay-app/
├── app/                    # Páginas principales de la aplicación
│   ├── dashboard.js       # Dashboard principal
│   ├── login.js          # Página de inicio de sesión
│   ├── register.js       # Página de registro
│   └── profile.js        # Perfil de usuario
├── components/            # Componentes reutilizables
├── services/             # Servicios para comunicación con el API
├── config/               # Configuraciones
└── assets/              # Recursos estáticos
```

## Funcionalidades Principales

1. **Autenticación**
   - Registro de usuarios
   - Inicio de sesión
   - Cierre de sesión

2. **Gestión de Cuentas**
   - Ver lista de cuentas bancarias
   - Crear nuevas cuentas
   - Actualizar balances
   - Eliminar cuentas

3. **Perfil de Usuario**
   - Ver información personal
   - Actualizar datos del perfil
   - Ver estadísticas de cuentas

## API Endpoints

### Autenticación
- Login: `POST /api/auth/login`
- Registro: `POST /api/users/register`

### Usuarios
- Obtener usuario por email: `GET /api/users/email/{email}`
- Actualizar usuario: `PUT /api/users/{id}`

### Cuentas
- Obtener cuentas: `GET /api/accounts/{userId}`
- Crear cuenta: `POST /api/accounts/register/{userId}`
- Actualizar balance: `PUT /api/accounts/update/{accountNumber}`
- Eliminar cuenta: `DELETE /api/accounts/delete/{accountId}`

## Formatos de Datos

### Registro de Usuario
```json
{
  "name": "Nombre Usuario",
  "email": "usuario@email.com",
  "password": "contraseña"
}
```

### Crear Cuenta Bancaria
```json
{
  "accountNumber": "ES79217711",
  "initialBalance": 1000
}
```

## Solución de Problemas Comunes

1. **Error de conexión al API**
   - Verifica que la URL en `config/env.js` sea correcta
   - Asegúrate de que el servidor backend esté ejecutándose

2. **Errores de CORS**
   - Verifica que estés usando la IP correcta del servidor
   - Asegúrate de que el backend tenga configurados los headers CORS

3. **Errores de autenticación**
   - Verifica que el token se esté almacenando correctamente
   - Asegúrate de que las credenciales sean correctas
