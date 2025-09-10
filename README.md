# 🎨 API de Gestión de Stock y Fórmulas

Esta API proporciona endpoints para gestionar el inventario de colores y fórmulas químicas. 🌈🧪

## 🌐 Base URLs
- **Stock:** `/stock` - Gestión de colores y pigmentos
- **Fórmulas:** `/formulas` - Gestión de fórmulas químicas

## 🚀 Despliegue en Render

Para desplegar esta API en Render, sigue estos pasos:

1. 📝 Crea una cuenta en [Render](https://render.com/) si aún no tienes una.

2. 🔗 Conecta tu repositorio de GitHub a Render:
   - Ve a tu dashboard de Render
   - Haz clic en "New" y selecciona "Web Service"
   - Conecta tu cuenta de GitHub y selecciona el repositorio

3. ⚙️ Configura el servicio:
   - **Nombre**: Elige un nombre para tu servicio
   - **Runtime**: Bun 🥟
   - **Build Command**: `bun install && bun run build`
   - **Start Command**: `bun run start`

4. 🔐 Configura las variables de entorno:
   - Añade `DATABASE_URL` con la URL de tu base de datos Turso

5. ✅ Haz clic en "Create Web Service"

## 🔑 Variables de entorno requeridas

- `DATABASE_URL`: URL de conexión a tu base de datos Turso 🗄️
- `PORT`: Puerto en el que se ejecutará la aplicación (Render lo configura automáticamente) 🔌

## 📦 Endpoints de Stock

### 📋 Obtener todo el stock
- **Método:** GET 🔍
- **Ruta:** `/`
- **Descripción:** Retorna la lista completa de colores en stock
- **Respuesta:** Lista de productos con su cantidad

### ➕ Agregar un nuevo color
- **Método:** POST 📝
- **Ruta:** `/`
- **Body:**
  ```json
  {
    "name": "string",
    "quantity": number
  }
  ```
- **Descripción:** Agrega un nuevo color al inventario 🎨
- **Validación:** No permite duplicados (nombre case-insensitive) ⚠️
- **Respuesta:** 
  - Éxito (201): Mensaje de confirmación ✅
  - Error (400): Si el producto ya existe ❌

### 🔄 Actualizar un color
- **Método:** PUT 📝
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
- **Descripción:** Actualiza la información de un color existente 🔄
- **Respuesta:**
  - Éxito: Datos actualizados ✅
  - Error (404): Si el color no existe ❌

### 🗑️ Eliminar un color
- **Método:** DELETE 🚫
- **Ruta:** `/:name`
- **Parámetros:**
  - name: Nombre del color a eliminar
- **Descripción:** Elimina un color del inventario 🗑️
- **Respuesta:**
  - Éxito: Confirmación de eliminación ✅
  - Error (404): Si el color no existe ❌

## 🧪 Endpoints de Fórmulas

Base URL: `/formulas` 🔬

### 📋 Obtener todas las fórmulas
- **Método:** GET 🔍
- **Ruta:** `/`
- **Descripción:** Retorna la lista completa de fórmulas 📜
- **Optimización:** 1 query con LEFT JOIN (sin N+1) ⚡
- **Respuesta:** Lista de fórmulas con sus ingredientes

### 🏷️ Obtener solo nombres de fórmulas
- **Método:** GET 📝
- **Ruta:** `/names`
- **Descripción:** Retorna únicamente los nombres de todas las fórmulas
- **Optimización:** Query ligera (solo id y name) 🚀
- **Respuesta:** Lista de objetos `{id, name}`

### 🔍 Obtener una fórmula específica
- **Método:** GET 🎯
- **Ruta:** `/:name`
- **Parámetros:**
  - name: Nombre de la fórmula a consultar
- **Descripción:** Retorna los detalles completos de una fórmula específica 🧪
- **Optimización:** 1 query con LEFT JOIN (sin N+1) ⚡
- **Respuesta:**
  - Éxito: Datos de la fórmula con sus ingredientes ✅
  - Error (404): Si la fórmula no existe ❌

### ➕ Agregar una nueva fórmula
- **Método:** POST 📝
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
- **Descripción:** Agrega una nueva fórmula al sistema 🧪
- **Validación:** No permite duplicados (nombre case-insensitive) ⚠️
- **Respuesta:** 
  - Éxito (201): Mensaje de confirmación y datos de la fórmula creada ✅
  - Error (400): Si la fórmula ya existe ❌

### 🔄 Actualizar una fórmula
- **Método:** PUT 📝
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
- **Descripción:** Actualiza la información de una fórmula existente 🔄
- **Respuesta:**
  - Éxito: Mensaje de confirmación y datos actualizados ✅
  - Error (404): Si la fórmula no existe ❌
  - Error (400): Si el nuevo nombre ya existe ⚠️

### 🗑️ Eliminar una fórmula
- **Método:** DELETE 🚫
- **Ruta:** `/:name`
- **Parámetros:**
  - name: Nombre de la fórmula a eliminar
- **Descripción:** Elimina una fórmula del sistema 🗑️
- **Respuesta:**
  - Éxito: Confirmación de eliminación ✅
  - Error (404): Si la fórmula no existe ❌

## ⚡ Optimizaciones de Rendimiento

Esta API incluye optimizaciones avanzadas para mejorar el rendimiento:

### 🚀 Problema N+1 Resuelto
- **Antes:** Múltiples queries para obtener fórmulas con ingredientes
- **Después:** Una sola query optimizada con LEFT JOIN
- **Beneficio:** -90% de queries, mucho más rápido ⚡

### 📊 Endpoints Optimizados
| Endpoint | Optimización | Queries | Mejora |
|----------|--------------|---------|---------|
| `GET /formulas` | LEFT JOIN | 1 | -90% |
| `GET /formulas/:name` | LEFT JOIN | 1 | -50% |
| `GET /formulas/names` | Campos selectivos | 1 | Óptimo |

### 🔧 Tecnologías y Arquitectura
- **Framework:** Hono (ultra-rápido) 🔥
- **ORM:** Drizzle con optimizaciones de query 🗄️
- **Base de datos:** Turso (SQLite distribuido) ⚡
- **Validación:** Zod para type safety ✅
- **Runtime:** Bun para desarrollo rápido 🥟
- **Linting:** ESLint + Prettier para código limpio 🧹

## 🛠️ Tecnologías Utilizadas
- 🔥 **Hono** - Framework web ultra-rápido
- 🗄️ **Drizzle ORM** - ORM optimizado con consultas eficientes
- ✅ **Zod** - Validación de datos y type safety
- 🥟 **Bun** - Runtime moderno para desarrollo
- 📊 **Turso** - Base de datos SQLite distribuida
- 🧹 **ESLint + Prettier** - Linting y formateo de código

## 🚀 Instalación y Ejecución

Para instalar dependencias:
```sh
bun install 📦
```

Para ejecutar en modo desarrollo:
```sh
bun run dev 🔧
```

🌐 Abre http://localhost:3000

## 📈 Características Destacadas

- ✅ **API RESTful completa** para gestión de stock y fórmulas
- ⚡ **Optimizaciones de rendimiento** (problema N+1 resuelto)
- 🔒 **Validación robusta** con Zod
- 🗄️ **Base de datos optimizada** con Turso
- 📝 **Documentación completa** con ejemplos
- 🧪 **Type safety** completo con TypeScript
- 🚀 **Despliegue fácil** en Render

## 🎯 Endpoints Disponibles

### Stock Management (7 endpoints)
- `GET /stock` - Listar todos los colores
- `POST /stock` - Agregar color
- `PUT /stock/:name` - Actualizar color
- `DELETE /stock/:name` - Eliminar color

### Formula Management (5 endpoints)
- `GET /formulas` - Listar todas las fórmulas con ingredientes
- `GET /formulas/names` - Listar solo nombres de fórmulas
- `GET /formulas/:name` - Obtener fórmula específica
- `POST /formulas` - Crear nueva fórmula
- `PUT /formulas/:name` - Actualizar fórmula
- `DELETE /formulas/:name` - Eliminar fórmula

---

# 🎨 api-rubber-hono

¡Una API moderna, optimizada y completa para gestionar tu inventario de colores y fórmulas químicas! 🌈🧪✨
