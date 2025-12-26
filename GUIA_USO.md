# 🎨 GUÍA DE USO - Interface & Funcionalidades

## 🌐 Pantallas Disponibles

### 1. **Página Principal** (`/`)
```
┌─────────────────────────────────────────────┐
│  [Logo] ExamenFe                  [Cursos][Profesores]
├─────────────────────────────────────────────┤
│                                             │
│  Página de bienvenida                       │
│  (Home/Index.cshtml)                        │
│                                             │
│  Links a:                                   │
│  - Gestión de Cursos                       │
│  - Gestión de Profesores                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 2. **Gestión de Cursos** (`/Cursos`)
```
┌────────────────────────────────────────────────────────┐
│  [Logo] ExamenFe                    [Cursos][Profesores]
├────────────────────────────────────────────────────────┤
│                                                        │
│  Gestión de Cursos                 [+ Nuevo Curso]   │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ID │ Nombre │ Código │ Inicio │ Fin │ Prof │Estado│
│  │    │        │        │        │     │      │      │
│  │ 1  │ Curso1 │ C001   │ 01/01  │ 06/01│ 1   │ ✅  │
│  │ 2  │ Curso2 │ C002   │ 02/01  │ 07/01│ 2   │ ❌  │
│  │    │        │        │        │     │      │  🔍 ✏️ 🗑 │
│  │                                              │
│  │  Show X entries │        Showing 1 to 2 of 2 │
│  │  [Prev] [1] [Next]                          │
│  └──────────────────────────────────────────────────┘
│                                                        │
│  © 2025 ExamenFe Frontend                             │
└────────────────────────────────────────────────────────┘

Columnas:
├─ ID: Identificador único
├─ Nombre: Nombre del curso
├─ Código: Código alfanumérico
├─ Fecha Inicio: Fecha de inicio del curso
├─ Fecha Fin: Fecha de finalización
├─ Profesor: ID del profesor asignado
├─ Estado: Ícono indicador (✅ Activo / ❌ Inactivo)
└─ Acciones: Botones de operaciones
   ├─ 🔍 Ver: Abre modal de detalles
   ├─ ✏️ Editar: Abre modal de edición
   └─ 🗑 Eliminar: Pide confirmación y elimina
```

---

### 3. **Gestión de Profesores** (`/Profesores`)
```
┌────────────────────────────────────────────────────────┐
│  [Logo] ExamenFe                    [Cursos][Profesores]
├────────────────────────────────────────────────────────┤
│                                                        │
│  Gestión de Profesores          [+ Nuevo Profesor]   │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ID │ Nombre  │ Correo         │ Edad │ Salario  │
│  │    │         │                │      │          │
│  │ 1  │ Juan    │ juan@email.com │ 35   │ $50,000  │
│  │ 2  │ María   │ maria@email.com│ 32   │ $55,000  │
│  │    │         │                │      │   🔍 ✏️ 🗑│
│  │                                              │
│  │  Show X entries │        Showing 1 to 2 of 2 │
│  │  [Prev] [1] [Next]                          │
│  └──────────────────────────────────────────────────┘
│                                                        │
│  © 2025 ExamenFe Frontend                             │
└────────────────────────────────────────────────────────┘

Columnas:
├─ ID: Identificador único
├─ Nombre: Nombre completo del profesor
├─ Correo: Email del profesor
├─ Edad: Edad del profesor
├─ Salario: Salario (formato moneda)
└─ Acciones: Botones de operaciones
   ├─ 🔍 Ver: Abre modal de detalles
   ├─ ✏️ Editar: Abre modal de edición
   └─ 🗑 Eliminar: Pide confirmación y elimina
```

---

## 🔲 Modales Implementados

### Modal 1: Crear/Editar Curso
```
┌────────────────────────────────────────┐
│ Nuevo Curso                         [X] │
├────────────────────────────────────────┤
│                                        │
│ [Nombre]                               │
│ ┌──────────────────────────────────┐  │
│ │ Ingrese nombre del curso...      │  │
│ └──────────────────────────────────┘  │
│                                        │
│ [Código]                               │
│ ┌──────────────────────────────────┐  │
│ │ Ingrese código...                │  │
│ └──────────────────────────────────┘  │
│                                        │
│ [Fecha Inicio]                         │
│ ┌──────────────────────────────────┐  │
│ │ YYYY-MM-DD HH:MM                 │  │
│ └──────────────────────────────────┘  │
│                                        │
│ [Fecha Fin]                            │
│ ┌──────────────────────────────────┐  │
│ │ YYYY-MM-DD HH:MM                 │  │
│ └──────────────────────────────────┘  │
│                                        │
│ [Profesor]                             │
│ ┌──────────────────────────────────┐  │
│ │ Seleccionar profesor...          │  │
│ │ - Juan (ID: 1)                   │  │
│ │ - María (ID: 2)                  │  │
│ └──────────────────────────────────┘  │
│                                        │
│                                        │
│                     [Cancelar] [Guardar]
└────────────────────────────────────────┘

Campos:
├─ Nombre (required)
├─ Código (required)
├─ Fecha Inicio (required, datetime)
├─ Fecha Fin (required, datetime)
└─ Profesor (required, dropdown)

Botones:
├─ Cancelar → Cierra sin guardar
└─ Guardar → POST/PUT según crear/editar
```

### Modal 2: Ver Detalle Curso
```
┌────────────────────────────────────────┐
│ Detalle del Curso                   [X] │
├────────────────────────────────────────┤
│                                        │
│ ID:                        1           │
│ Nombre:                    Curso 1     │
│ Código:                    C001        │
│ Fecha Inicio:              01/01/2025  │
│ Fecha Fin:                 06/01/2025  │
│ Profesor ID:               1           │
│ Estado:                    ✅ Activo   │
│                                        │
│                            [Cerrar]    │
└────────────────────────────────────────┘

Información:
├─ Lectura solamente
├─ Muestra todos los datos del curso
└─ Formato legible para el usuario
```

### Modal 3: Confirmar Eliminación
```
┌────────────────────────────────────────┐
│ Confirmar Eliminación               [X] │
├────────────────────────────────────────┤
│                                        │
│ ¿Está seguro que desea eliminar       │
│ este curso?                            │
│                                        │
│ Curso 1                                │
│                                        │
│                                        │
│                  [Cancelar] [Eliminar] │
└────────────────────────────────────────┘

Función:
├─ Confirma antes de ejecutar DELETE
├─ Muestra nombre del elemento
└─ Botones: Cancelar (cierra) / Eliminar (DELETE)
```

---

## 🔔 Notificaciones (SweetAlert2)

### Notificación de Éxito
```
┌─────────────────────────────┐
│            ✅               │
│          ¡Éxito!            │
│                             │
│  Curso creado exitosamente  │
│                             │
│            [OK]             │
└─────────────────────────────┘

Casos:
├─ Crear curso/profesor
├─ Actualizar
├─ Eliminar confirmado
└─ Cambiar estado
```

### Notificación de Error
```
┌─────────────────────────────┐
│            ❌               │
│           Error             │
│                             │
│  No se pudo crear el curso  │
│  Error 400: Bad Request     │
│                             │
│            [OK]             │
└─────────────────────────────┘

Casos:
├─ Validación fallida
├─ HTTP errors (400, 404, 500)
├─ Conexión rechazada
└─ Errores de aplicación
```

---

## ⌨️ Flujo de Interacción

### Crear un Curso

```
1. Usuario abre /Cursos
   ↓
2. Tabla carga con GET /Cursos/GetCursos
   ↓
3. Usuario hace clic en [+ Nuevo Curso]
   ↓
4. Modal se abre vacío
   ↓
5. Usuario completa formulario
   ↓
6. Usuario hace clic [Guardar]
   ↓
7. AJAX POST /Cursos/Create con datos
   ↓
8. Si OK → ✅ Notificación + Tabla recarga
   Si Error → ❌ Notificación con detalle
```

### Editar un Curso

```
1. Usuario abre /Cursos
   ↓
2. Tabla carga y muestra filas
   ↓
3. Usuario hace clic en ✏️ (Editar)
   ↓
4. AJAX GET /Cursos/GetById/{id}
   ↓
5. Modal se abre CON datos precargados
   ↓
6. Usuario modifica campos
   ↓
7. Usuario hace clic [Guardar]
   ↓
8. AJAX PUT /Cursos/Update con datos
   ↓
9. Si OK → ✅ Notificación + Tabla recarga
   Si Error → ❌ Notificación con detalle
```

### Eliminar un Curso

```
1. Usuario abre /Cursos
   ↓
2. Tabla carga y muestra filas
   ↓
3. Usuario hace clic en 🗑 (Eliminar)
   ↓
4. Modal de confirmación aparece
   ↓
5. Usuario hace clic [Eliminar]
   ↓
6. AJAX DELETE /Cursos/Delete/{id}
   ↓
7. Si OK → ✅ Notificación + Tabla recarga
   Si Error → ❌ Notificación con detalle
```

### Ver Detalle

```
1. Usuario abre /Cursos
   ↓
2. Tabla carga y muestra filas
   ↓
3. Usuario hace clic en 🔍 (Ver)
   ↓
4. AJAX GET /Cursos/GetById/{id}
   ↓
5. Modal de lectura aparece con datos
   ↓
6. Usuario revisa información
   ↓
7. Usuario hace clic [Cerrar]
   ↓
8. Modal se cierra
```

---

## 🔍 Características de DataTable

### Búsqueda Global
- Busca en todos los campos de la tabla
- Búsqueda en tiempo real (mientras escribes)

### Paginación
- Opciones: 5, 10, 25, 50 registros por página
- Navegación: Anterior, Número de página, Siguiente

### Ordenamiento
- Click en encabezado para ordenar
- Orden ascendente/descendente
- Indicador visual de columna ordenada

### Información
- "Showing X to Y of Z entries"
- Actualización dinámica al filtrar

---

## 🎓 Ejemplo Completo: Crear Curso

### Paso 1: Abrir página
```
URL: https://localhost:7260/Cursos
Estado: Tabla cargada con cursos existentes
```

### Paso 2: Hacer clic "Nuevo Curso"
```
Modal se abre con:
- Title: "Nuevo Curso"
- Campos vacíos
- Select de profesores cargado
```

### Paso 3: Completar formulario
```
Nombre:      "Matemática Avanzada"
Código:      "MAT-401"
Inicio:      "2025-01-15 09:00"
Fin:         "2025-06-15 18:00"
Profesor:    "Juan (ID: 1)"
```

### Paso 4: Hacer clic "Guardar"
```
AJAX POST /Cursos/Create
Body JSON:
{
  "nombre": "Matemática Avanzada",
  "codigo": "MAT-401",
  "fechaInicio": "2025-01-15T09:00:00",
  "fechaFin": "2025-06-15T18:00:00",
  "idProfesor": 1
}
```

### Paso 5: Respuesta OK
```
Response:
{
  "success": true,
  "message": "Operación completada exitosamente",
  "data": {
    "id": 3,
    "nombre": "Matemática Avanzada",
    ...
  }
}

Frontend:
✅ Notificación "¡Éxito! Operación completada exitosamente"
- Modal se cierra
- Tabla se recarga
- Nuevo curso aparece en la tabla
```

### Paso 6: Ver nuevo curso
```
La tabla ahora muestra:
ID │ Nombre                 │ Código  │ ...
3  │ Matemática Avanzada    │ MAT-401 │ ...
```

---

## 🛡️ Validaciones Implementadas

### Cliente (HTML5)
```
- Campos required (*)
- Email validation
- Number range (edad 1-150)
- Datetime format
```

### Servidor (Backend)
```
- ModelState validation
- Type checking
- Business logic
```

### Errores Mostrados
```
Si validación falla:
❌ "Datos inválidos"
   - Campo nombre: "Este campo es requerido"
   - Campo correo: "Formato inválido"
```

---

## ✨ Conclusión

El frontend proporciona:
✅ Interface intuitiva y moderna  
✅ Operaciones CRUD completas  
✅ Manejo robusto de errores  
✅ Feedback inmediato al usuario  
✅ Datos sincronizados con el servidor  
✅ Experiencia de usuario profesional  

**¡Listo para usar con el backend API!**
