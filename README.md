# API de Gestión de Stock

Esta API proporciona endpoints para gestionar el inventario de colores.

## Base URL
`/stock`

## Despliegue en Render

Para desplegar esta API en Render, sigue estos pasos:

1. Crea una cuenta en [Render](https://render.com/) si aún no tienes una.

2. Conecta tu repositorio de GitHub a Render:
   - Ve a tu dashboard de Render
   - Haz clic en "New" y selecciona "Web Service"
   - Conecta tu cuenta de GitHub y selecciona el repositorio

3. Configura el servicio:
   - **Nombre**: Elige un nombre para tu servicio
   - **Runtime**: Bun
   - **Build Command**: `bun install && bun run build`
   - **Start Command**: `bun run start`

4. Configura las variables de entorno:
   - Añade `DATABASE_URL` con la URL de tu base de datos Turso

5. Haz clic en "Create Web Service"

## Variables de entorno requeridas

- `DATABASE_URL`: URL de conexión a tu base de datos Turso
- `PORT`: Puerto en el que se ejecutará la aplicación (Render lo configura automáticamente)

## Endpoints de Stock

### Obtener todo el stock
- **Método:** GET
- **Ruta:** `/`
- **Descripción:** Retorna la lista completa de colores en stock
- **Respuesta:** Lista de productos con su cantidad

### Agregar un nuevo color
- **Método:** POST
- **Ruta:** `/`
- **Body:**
  ```json
  {
    "name": "string",
    "quantity": number
  }
  ```
- **Descripción:** Agrega un nuevo color al inventario
- **Validación:** No permite duplicados (nombre case-insensitive)
- **Respuesta:** 
  - Éxito (201): Mensaje de confirmación
  - Error (400): Si el producto ya existe

### Actualizar un color
- **Método:** PUT
- **Ruta:** `/:name`
- **Parámetros:** 
  - name: Nombre del color a actualizar
- **Body:**
  ```json
  {
    "name": "string",
    "quantity": number
  }
  ```
- **Descripción:** Actualiza la información de un color existente
- **Respuesta:**
  - Éxito: Datos actualizados
  - Error (404): Si el color no existe

### Eliminar un color
- **Método:** DELETE
- **Ruta:** `/:name`
- **Parámetros:**
  - name: Nombre del color a eliminar
- **Descripción:** Elimina un color del inventario
- **Respuesta:**
  - Éxito: Confirmación de eliminación
  - Error (404): Si el color no existe

## Endpoints de Fórmulas

Base URL: `/formulas`

### Obtener todas las fórmulas
- **Método:** GET
- **Ruta:** `/`
- **Descripción:** Retorna la lista completa de fórmulas
- **Respuesta:** Lista de fórmulas con sus ingredientes

### Obtener una fórmula específica
- **Método:** GET
- **Ruta:** `/:name`
- **Parámetros:** 
  - name: Nombre de la fórmula a consultar
- **Descripción:** Retorna los detalles de una fórmula específica
- **Respuesta:**
  - Éxito: Datos de la fórmula con sus ingredientes
  - Error (404): Si la fórmula no existe

### Agregar una nueva fórmula
- **Método:** POST
- **Ruta:** `/`
- **Body:**
  ```json
  {
    "name": "string",
    "ingredients": [
      {
        "name": "string",
        "quantity": number
      }
    ]
  }
  ```
- **Descripción:** Agrega una nueva fórmula al sistema
- **Validación:** No permite duplicados (nombre case-insensitive)
- **Respuesta:** 
  - Éxito (201): Mensaje de confirmación y datos de la fórmula creada
  - Error (400): Si la fórmula ya existe

### Actualizar una fórmula
- **Método:** PUT
- **Ruta:** `/:name`
- **Parámetros:** 
  - name: Nombre de la fórmula a actualizar
- **Body:**
  ```json
  {
    "name": "string",
    "ingredients": [
      {
        "name": "string",
        "quantity": number
      }
    ]
  }
  ```
- **Descripción:** Actualiza la información de una fórmula existente
- **Respuesta:**
  - Éxito: Mensaje de confirmación y datos actualizados
  - Error (404): Si la fórmula no existe
  - Error (400): Si el nuevo nombre ya existe

### Eliminar una fórmula
- **Método:** DELETE
- **Ruta:** `/:name`
- **Parámetros:**
  - name: Nombre de la fórmula a eliminar
- **Descripción:** Elimina una fórmula del sistema
- **Respuesta:**
  - Éxito: Confirmación de eliminación
  - Error (404): Si la fórmula no existe

## Tecnologías Utilizadas
- Hono (Framework)
- Drizzle ORM
- Zod (Validación)

To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000
# api-rubber-hono
