# APP CLIENT

Este proyecto se conecta a una API para gestionar clientes.

## Cambiar la IP del API

Para conectar la aplicación a la API correcta, debes modificar la IP en el archivo `src/services/api.ts`. Encuentra la constante `API_URL` y reemplaza la IP por la que necesitas usar:

```typescript
// src/services/api.ts
const API_URL = 'http://[TU_IP]:8080/client';