# 🏛️ Arquitectura Clean Architecture - ExamenFe Frontend

## Descripción de la Arquitectura

El proyecto implementa **Clean Architecture** en 4 capas claramente separadas:

```
                    ┌─────────────────────┐
                    │   Frontend.Web      │  (ASP.NET Core MVC)
                    │  - Controllers      │
                    │  - Views (Razor)    │
                    │  - wwwroot (Assets) │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Frontend.          │  (Lógica de Aplicación)
                    │  Application        │
                    │  - DTOs             │
                    │  - Interfaces       │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Frontend.         │  (Implementación)
                    │  Infrastructure    │
                    │  - HttpClient       │
                    │  - Services         │
                    │  - Settings         │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Frontend.Domain   │  (Entidades Core)
                    └─────────────────────┘
```

---

## 🔹 Capa 1: Frontend.Web (MVC - Presentación)

**Responsabilidad**: Interfaz de usuario, interacción con el usuario

### Componentes:

#### Controllers/
- **CursosController.cs**
  - `Index()` → Renderiza vista Index
  - `GetCursos()` → Retorna JSON con lista paginada
  - `GetById(id)` → Retorna detalle de un curso
  - `Create([FromBody] CrearCursoCommand)` → POST para crear
  - `Update([FromBody] ActualizarCursoCommand)` → PUT para actualizar
  - `Delete(id)` → DELETE para eliminar
  - `CambiarEstado([FromBody] CambiarEstadoCursoCommand)` → PATCH para cambiar estado

- **ProfesoresController.cs**
  - `Index()` → Renderiza vista Index
  - `GetProfesores()` → Retorna JSON con lista paginada
  - `GetById(id)` → Retorna detalle de un profesor
  - `Create([FromBody] CrearProfesorCommand)` → POST para crear
  - `Update([FromBody] ActualizarProfesorCommand)` → PUT para actualizar
  - `Delete(id)` → DELETE para eliminar

#### Views/
- **Views/Cursos/Index.cshtml**
  - Tabla DataTables para listar cursos
  - Modales para CRUD completo
  - Integración AJAX con cursos.js

- **Views/Profesores/Index.cshtml**
  - Tabla DataTables para listar profesores
  - Modales para CRUD completo
  - Integración AJAX con profesores.js

- **Views/Shared/_Layout.cshtml**
  - Layout maestro con navbar
  - Links a DataTables, Bootstrap, SweetAlert2
  - Secciones para Scripts y Head

#### wwwroot/
- **js/helpers/ajax-helper.js**
  - `AjaxHelper.request()` → Centraliza todas las llamadas AJAX
  - Manejo de errores estándar
  - Notificaciones con SweetAlert2
  - Validación de respuestas

- **js/pages/cursos.js**
  - Inicialización de DataTable
  - Eventos de botones (Nuevo, Editar, Ver, Eliminar)
  - Comunicación con CursosController
  - Carga dinámica de profesores en select

- **js/pages/profesores.js**
  - Inicialización de DataTable
  - Eventos de botones (Nuevo, Editar, Ver, Eliminar)
  - Comunicación con ProfesoresController

#### appsettings.json
```json
{
  "ApiSettings": {
    "BaseUrl": "https://localhost:5001"  // URL del backend
  }
}
```

---

## 🔹 Capa 2: Frontend.Application (Lógica)

**Responsabilidad**: DTOs, interfaces de servicios, contratos

### DTOs/

#### Cursos/
- **CrearCursoCommand.cs** - DTO para crear curso
- **ActualizarCursoCommand.cs** - DTO para actualizar curso
- **CursoDTO.cs** - DTO para representar un curso

#### Profesores/
- **CrearProfesorCommand.cs** - DTO para crear profesor
- **ActualizarProfesorCommand.cs** - DTO para actualizar profesor
- **ProfesorDTO.cs** - DTO para representar un profesor

#### Common/
- **ApiResponse<T>** - Envoltorio genérico para respuestas del API
- **PaginatedResponse<T>** - Respuesta con paginación

### Services/Interfaces/

- **ICursosApiService**
  ```csharp
  Task<ApiResponse<PaginatedResponse<CursoDTO>>> GetCursosAsync(int page, int pageSize, int? idProfesor = null);
  Task<ApiResponse<CursoDTO>> GetCursoByIdAsync(int id);
  Task<ApiResponse<CursoDTO>> CrearCursoAsync(CrearCursoCommand command);
  Task<ApiResponse<CursoDTO>> ActualizarCursoAsync(ActualizarCursoCommand command);
  Task<ApiResponse<bool>> EliminarCursoAsync(int id);
  Task<ApiResponse<bool>> CambiarEstadoCursoAsync(CambiarEstadoCursoCommand command);
  ```

- **IProfesoresApiService**
  ```csharp
  Task<ApiResponse<PaginatedResponse<ProfesorDTO>>> GetProfesoresAsync(int page, int pageSize);
  Task<ApiResponse<ProfesorDTO>> GetProfesorByIdAsync(int id);
  Task<ApiResponse<ProfesorDTO>> CrearProfesorAsync(CrearProfesorCommand command);
  Task<ApiResponse<ProfesorDTO>> ActualizarProfesorAsync(ActualizarProfesorCommand command);
  Task<ApiResponse<bool>> EliminarProfesorAsync(int id);
  ```

---

## 🔹 Capa 3: Frontend.Infrastructure (Implementación)

**Responsabilidad**: Implementación de servicios, acceso a recursos externos

### HttpClients/

**BaseApiService.cs** - Clase base para todos los servicios API
```csharp
protected Task<ApiResponse<T>> GetAsync<T>(string endpoint)
protected Task<ApiResponse<T>> PostAsync<T>(string endpoint, object? data = null)
protected Task<ApiResponse<T>> PutAsync<T>(string endpoint, object? data = null)
protected Task<ApiResponse<T>> PatchAsync<T>(string endpoint, object? data = null)
protected Task<ApiResponse<T>> DeleteAsync<T>(string endpoint)
private Task<ApiResponse<T>> HandleResponse<T>(HttpResponseMessage response)
```

- Manejo centralizado de HTTP
- Serialización/Deserialización JSON
- Parseo de errores
- Manejo de status codes

### Services/

- **CursosApiService : BaseApiService, ICursosApiService**
  - Implementa todas las operaciones CRUD para cursos
  - Construye URLs con parámetros de paginación y filtrado

- **ProfesoresApiService : BaseApiService, IProfesoresApiService**
  - Implementa todas las operaciones CRUD para profesores
  - Construye URLs con parámetros de paginación

### Settings/

- **ApiSettings.cs**
  ```csharp
  public string BaseUrl { get; set; }  // https://localhost:5001
  ```

---

## 🔹 Capa 4: Frontend.Domain (Entidades)

**Responsabilidad**: Modelos de dominio (vacío en esta versión, extensible)

---

## 📋 Flujo de Datos (Ejemplo: Crear un Curso)

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Usuario hace clic en "Nuevo Curso"                        │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│ 2. cursos.js dispara click → Abre modal #modalCurso          │
│    (Frontend.Web - Presentación)                              │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│ 3. Usuario completa formulario y hace clic en "Guardar"      │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│ 4. cursos.js → AjaxHelper.request({                          │
│     url: '/Cursos/Create',                                   │
│     type: 'POST',                                             │
│     data: { nombre, codigo, fechaInicio, ... }              │
│   })                                                          │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│ 5. CursosController.Create([FromBody] CrearCursoCommand)     │
│    (Frontend.Web - Controller)                               │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│ 6. Inyector invoca ICursosApiService.CrearCursoAsync(cmd)   │
│    (Frontend.Application - Interface)                        │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│ 7. CursosApiService.CrearCursoAsync(command)                │
│    (Frontend.Infrastructure - Implementación)               │
│    → Construye URL: https://localhost:5001/api/cursos       │
│    → Llama PostAsync<CursoDTO>()                            │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│ 8. BaseApiService.PostAsync()                               │
│    → HttpClient.PostAsJsonAsync(url, command)              │
│    → Serializa objeto a JSON                               │
│    (Frontend.Infrastructure - Base)                         │
└──────────────────────┬───────────────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │      BACKEND API            │
        │  POST /api/cursos           │
        │  (ExamenProcomerBackend)   │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │   Respuesta JSON:           │
        │   {                         │
        │     "success": true,        │
        │     "message": "...",       │
        │     "data": { id, ... }    │
        │   }                         │
        └──────────────┬──────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│ 9. BaseApiService.HandleResponse()                          │
│    → Deserializa respuesta JSON a ApiResponse<CursoDTO>    │
│    (Frontend.Infrastructure)                               │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│ 10. CursosController.Create() retorna Json(response)        │
│     (Frontend.Web)                                           │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│ 11. Ajax success callback en cursos.js                      │
│     (Frontend.Web - JavaScript)                             │
│     if (response.success) {                                 │
│       AjaxHelper.showSuccess("Curso creado")                │
│       table.ajax.reload()                                   │
│       $('#modalCurso').modal('hide')                        │
│     }                                                        │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│ 12. Tabla se recarga y muestra nuevo curso                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔐 Inversión de Dependencias (Dependency Inversion)

### Program.cs (Inyección de Dependencias)

```csharp
// Configurar opciones desde appsettings.json
builder.Services.Configure<ApiSettings>(
    builder.Configuration.GetSection("ApiSettings")
);

// Registrar HttpClient con CursosApiService
builder.Services.AddHttpClient<ICursosApiService, CursosApiService>();

// Registrar HttpClient con ProfesoresApiService
builder.Services.AddHttpClient<IProfesoresApiService, ProfesoresApiService>();
```

### Inyección en Controllers

```csharp
public class CursosController : Controller
{
    private readonly ICursosApiService _cursosApiService;
    
    public CursosController(ICursosApiService cursosApiService)
    {
        _cursosApiService = cursosApiService;  // Inyectado por DI
    }
}
```

---

## 🎯 Ventajas de Esta Arquitectura

| Beneficio | Cómo se logra |
|-----------|---------------|
| **Testeable** | Interfaces permiten mocks fáciles |
| **Mantenible** | Separación clara de responsabilidades |
| **Escalable** | Nuevas entidades sin cambiar código existente |
| **Reutilizable** | BaseApiService reutilizable para nuevos servicios |
| **Desacoplado** | Controllers no conocen detalles de HTTP |
| **Independiente** | Frontend independiente del backend |

---

## 📦 Referencias entre Capas

```
Frontend.Web
  ├─ referencia → Frontend.Application ✓
  ├─ referencia → Frontend.Infrastructure ✓ (solo para DI en Program.cs)
  └─ NO referencia → Frontend.Domain

Frontend.Application
  ├─ referencia → Frontend.Domain ✓
  └─ NO referencia → Frontend.Web, Frontend.Infrastructure

Frontend.Infrastructure
  ├─ referencia → Frontend.Application ✓
  ├─ referencia → Frontend.Domain ✓
  └─ NO referencia → Frontend.Web

Frontend.Domain
  └─ NO referencia a ningún otro proyecto
```

---

## ✨ Conclusión

La arquitectura Clean Architecture permite:
1. **Independencia de frameworks** - Cambiar ASP.NET no afecta lógica core
2. **Independencia de UI** - Cambiar de MVC a Blazor sin cambios mayores
3. **Independencia de base de datos** - HttpClient es inyectable
4. **Testeable** - Cada capa puede probarse independientemente
5. **Mantenible** - Código claro, estructurado y organizado

Este proyecto es un ejemplo práctico de Clean Architecture en .NET 8.
