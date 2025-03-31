# API de Gestión de Stock

Esta API proporciona endpoints para gestionar el inventario de colores.

## Base URL
`/stock`

## Endpoints

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
