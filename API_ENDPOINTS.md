# Documentación de Endpoints de API

Este documento describe los endpoints de API disponibles en la aplicación Scatly, sus parámetros, respuestas y ejemplos de uso.

## Endpoints de Proyectos

### Obtener todos los proyectos

```
GET /api/projects
```

**Respuesta exitosa (200 OK)**

```json
{
  "success": true,
  "timestamp": "2023-11-15T12:34:56.789Z",
  "count": 5,
  "projects": [
    {
      "id": 1,
      "nombre": "Proyecto 1",
      "descripcion": "Descripción del proyecto 1",
      "created_at": "2023-11-15T10:30:00.000Z",
      "updated_at": "2023-11-15T10:30:00.000Z"
    },
    // ... más proyectos
  ]
}
```

**Respuesta de error (500 Internal Server Error)**

```json
{
  "success": false,
  "timestamp": "2023-11-15T12:34:56.789Z",
  "error": "Error al obtener proyectos de la base de datos",
  "details": "Mensaje de error específico"
}
```

### Obtener un proyecto específico

```
GET /api/projects/{id}
```

**Parámetros de ruta**

- `id` (número): ID del proyecto a obtener

**Respuesta exitosa (200 OK)**

```json
{
  "success": true,
  "timestamp": "2023-11-15T12:34:56.789Z",
  "project": {
    "id": 1,
    "nombre": "Proyecto 1",
    "descripcion": "Descripción del proyecto 1",
    "created_at": "2023-11-15T10:30:00.000Z",
    "updated_at": "2023-11-15T10:30:00.000Z"
  }
}
```

**Respuesta de error (404 Not Found)**

```json
{
  "success": false,
  "timestamp": "2023-11-15T12:34:56.789Z",
  "error": "Proyecto no encontrado"
}
```

**Respuesta de error (500 Internal Server Error)**

```json
{
  "success": false,
  "timestamp": "2023-11-15T12:34:56.789Z",
  "error": "Error al obtener el proyecto",
  "details": "Mensaje de error específico"
}
```

### Crear un nuevo proyecto

```
POST /api/projects
```

**Cuerpo de la solicitud**

```json
{
  "nombre": "Nuevo Proyecto",
  "descripcion": "Descripción del nuevo proyecto"
}
```

**Respuesta exitosa (201 Created)**

```json
{
  "success": true,
  "timestamp": "2023-11-15T12:34:56.789Z",
  "message": "Proyecto creado exitosamente",
  "project": {
    "id": 6,
    "nombre": "Nuevo Proyecto",
    "descripcion": "Descripción del nuevo proyecto",
    "created_at": "2023-11-15T12:34:56.789Z",
    "updated_at": "2023-11-15T12:34:56.789Z"
  }
}
```

**Respuesta de error (500 Internal Server Error)**

```json
{
  "success": false,
  "timestamp": "2023-11-15T12:34:56.789Z",
  "error": "Error al crear el proyecto",
  "details": "Mensaje de error específico"
}
```

### Actualizar un proyecto existente

```
PUT /api/projects/{id}
```

**Parámetros de ruta**

- `id` (número): ID del proyecto a actualizar

**Cuerpo de la solicitud**

```json
{
  "nombre": "Proyecto Actualizado",
  "descripcion": "Descripción actualizada del proyecto"
}
```

**Respuesta exitosa (200 OK)**

```json
{
  "success": true,
  "timestamp": "2023-11-15T12:34:56.789Z",
  "message": "Proyecto actualizado exitosamente",
  "project": {
    "id": 1,
    "nombre": "Proyecto Actualizado",
    "descripcion": "Descripción actualizada del proyecto",
    "created_at": "2023-11-15T10:30:00.000Z",
    "updated_at": "2023-11-15T12:34:56.789Z"
  }
}
```

**Respuesta de error (404 Not Found)**

```json
{
  "success": false,
  "timestamp": "2023-11-15T12:34:56.789Z",
  "error": "Proyecto no encontrado"
}
```

**Respuesta de error (500 Internal Server Error)**

```json
{
  "success": false,
  "timestamp": "2023-11-15T12:34:56.789Z",
  "error": "Error al actualizar el proyecto",
  "details": "Mensaje de error específico"
}
```

### Eliminar un proyecto

```
DELETE /api/projects/{id}
```

**Parámetros de ruta**

- `id` (número): ID del proyecto a eliminar

**Respuesta exitosa (200 OK)**

```json
{
  "success": true,
  "timestamp": "2023-11-15T12:34:56.789Z",
  "message": "Proyecto eliminado correctamente",
  "id": 1
}
```

**Respuesta de error (404 Not Found)**

```json
{
  "success": false,
  "timestamp": "2023-11-15T12:34:56.789Z",
  "error": "Proyecto no encontrado"
}
```

**Respuesta de error (500 Internal Server Error)**

```json
{
  "success": false,
  "timestamp": "2023-11-15T12:34:56.789Z",
  "error": "Error al eliminar el proyecto",
  "details": "Mensaje de error específico"
}
```

## Características de los Endpoints

### Formato de respuesta consistente

Todas las respuestas de la API siguen un formato consistente que incluye:

- `success`: Booleano que indica si la operación fue exitosa
- `timestamp`: Marca de tiempo ISO 8601 que indica cuándo se procesó la solicitud
- Datos específicos de la respuesta (proyectos, mensajes, etc.)
- Información de error cuando corresponda

### Manejo de errores

Los errores se manejan de manera consistente en todos los endpoints:

- Errores 404 para recursos no encontrados
- Errores 500 para problemas del servidor
- Mensajes de error descriptivos
- Detalles adicionales cuando están disponibles

### Registro (Logging)

Todos los endpoints incluyen registro detallado para facilitar la depuración:

- Inicio de la solicitud
- Operaciones de base de datos
- Resultados exitosos
- Errores y excepciones

## Uso de la API

### Ejemplos con curl

**Obtener todos los proyectos**

```bash
curl -X GET http://localhost:3000/api/projects
```

**Obtener un proyecto específico**

```bash
curl -X GET http://localhost:3000/api/projects/1
```

**Crear un nuevo proyecto**

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Nuevo Proyecto","descripcion":"Descripción del nuevo proyecto"}'
```

**Actualizar un proyecto existente**

```bash
curl -X PUT http://localhost:3000/api/projects/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Proyecto Actualizado","descripcion":"Descripción actualizada del proyecto"}'
```

**Eliminar un proyecto**

```bash
curl -X DELETE http://localhost:3000/api/projects/1
```