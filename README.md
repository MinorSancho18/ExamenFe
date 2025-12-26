# ExamenFe - Frontend ASP.NET Core MVC

Proyecto frontend independiente en **ASP.NET Core 8 MVC** que consume la API REST del backend `ExamenProcomerBackend` basada en Minimal APIs.

El proyecto implementa **Clean Architecture** con una estructura clara de capas (Web, Application, Domain, Infrastructure) y proporciona una interfaz completa para gestionar **Cursos** y **Profesores**.

---

## 📋 Características

✅ **ASP.NET Core 8 MVC** - Framework web moderno  
✅ **Clean Architecture** - Separación clara de responsabilidades  
✅ **CRUD Completo** - Crear, Leer, Actualizar, Eliminar  
✅ **DataTables.net** - Tablas dinámicas con paginación  
✅ **Bootstrap 5** - Estilos y componentes responsivos  
✅ **Modales Bootstrap** - Para crear, editar, ver detalles y confirmar eliminación  
✅ **jQuery + AJAX** - Comunicación asincrónica con el backend  
✅ **SweetAlert2** - Notificaciones elegantes  
✅ **Consumo API HttpClient** - Configuración centralizada de URLs  
✅ **Inyección de Dependencias** - Registro automático de servicios  

---

## 🏗️ Estructura del Proyecto

```
src/
├── Frontend.Web/              # Proyecto MVC principal (Controllers, Views, wwwroot)
│   ├── Controllers/           # CursosController, ProfesoresController
│   ├── Views/                 # Vistas Razor
│   │   ├── Cursos/           # Views/Index para gestión de cursos
│   │   ├── Profesores/       # Views/Index para gestión de profesores
│   │   └── Shared/           # Layout y vistas compartidas
│   ├── wwwroot/              # Archivos estáticos (css, js)
│   │   └── js/
│   │       ├── helpers/      # ajax-helper.js
│   │       └── pages/        # cursos.js, profesores.js
│   ├── appsettings.json      # Configuración (URL del API)
│   └── Program.cs            # Configuración DI y startup
│
├── Frontend.Application/      # Capas de aplicación (DTOs, Servicios)
│   ├── DTOs/                 # Data Transfer Objects
│   │   ├── Cursos/           # CrearCursoCommand, ActualizarCursoCommand, CursoDTO
│   │   ├── Profesores/       # CrearProfesorCommand, ActualizarProfesorCommand, ProfesorDTO
│   │   └── Common/           # ApiResponse, PaginatedResponse
│   └── Services/
│       └── Interfaces/       # ICursosApiService, IProfesoresApiService
│
├── Frontend.Infrastructure/   # Implementación de servicios
│   ├── HttpClients/          # BaseApiService (helper HTTP centralizado)
│   ├── Services/             # CursosApiService, ProfesoresApiService
│   └── Settings/             # ApiSettings
│
└── Frontend.Domain/           # Modelos de dominio (puede expandirse)

tests/                        # Directorio para pruebas unitarias (opcional)
```

---

## 🔧 Configuración Previa

Asegúrate de que:
1. **El backend API está ejecutándose** en la URL especificada (por defecto: `https://localhost:5001`)
2. **.NET 8.x** está instalado en tu máquina
3. No tienes globales de `.NET` conflictivos

---

## 🚀 Pasos para Ejecutar

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd ExamenFe
```

### 2. Restaurar dependencias
```bash
dotnet restore
```

### 3. Configurar la URL del API (opcional)

Edita `src/Frontend.Web/appsettings.json` y ajusta la URL del backend:

```json
{
  "ApiSettings": {
    "BaseUrl": "https://localhost:5001"  // Cambia si es necesario
  }
}
```

### 4. Compilar la solución
```bash
dotnet build
```

Esperado: **Build succeeded. 0 Warning(s), 0 Error(s)**

### 5. Ejecutar la aplicación
```bash
cd src/Frontend.Web
dotnet run
```

Salida esperada:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7260
```

### 6. Abrir en el navegador
```
https://localhost:7260
```

---

## 📊 Funcionalidades por Entidad

### **Cursos**

| Operación | Endpoint | Método | Descripción |
|-----------|----------|--------|-------------|
| Listar | `/Cursos/GetCursos` | GET | Obtiene lista paginada de cursos |
| Obtener | `/Cursos/GetById` | GET | Obtiene detalle de un curso |
| Crear | `/Cursos/Create` | POST | Crea un nuevo curso |
| Actualizar | `/Cursos/Update` | PUT | Actualiza un curso existente |
| Eliminar | `/Cursos/Delete` | DELETE | Elimina un curso |
| Cambiar Estado | `/Cursos/CambiarEstado` | PATCH | Cambia estado (activo/inactivo) |

**Pantalla**: `/Cursos/Index`  
**Tabla**: DataTable con búsqueda y paginación  
**Modales**: 
- Crear/Editar (formulario)
- Ver detalle (lectura)
- Confirmar eliminación

---

### **Profesores**

| Operación | Endpoint | Método | Descripción |
|-----------|----------|--------|-------------|
| Listar | `/Profesores/GetProfesores` | GET | Obtiene lista paginada de profesores |
| Obtener | `/Profesores/GetById` | GET | Obtiene detalle de un profesor |
| Crear | `/Profesores/Create` | POST | Crea un nuevo profesor |
| Actualizar | `/Profesores/Update` | PUT | Actualiza un profesor existente |
| Eliminar | `/Profesores/Delete` | DELETE | Elimina un profesor |

**Pantalla**: `/Profesores/Index`  
**Tabla**: DataTable con búsqueda y paginación  
**Modales**:
- Crear/Editar (formulario)
- Ver detalle (lectura)
- Confirmar eliminación

---

## 📡 Consumo del API

### Flujo de Comunicación

```
Frontend (MVC)
    ↓
Controllers (CursosController, ProfesoresController)
    ↓
Services Interfaces (ICursosApiService, IProfesoresApiService)
    ↓
Services Implementations (CursosApiService, ProfesoresApiService)
    ↓
BaseApiService (Manejo centralizado de HTTP)
    ↓
Backend API (https://localhost:5001)
```

### Ejemplo: Consumo en el servicio

```csharp
public class CursosApiService : BaseApiService, ICursosApiService
{
    public async Task<ApiResponse<PaginatedResponse<CursoDTO>>> GetCursosAsync(int page, int pageSize, int? idProfesor = null)
    {
        var endpoint = $"{_apiSettings.BaseUrl}/api/cursos?page={page}&pageSize={pageSize}";
        if (idProfesor.HasValue)
            endpoint += $"&idProfesor={idProfesor.Value}";
        
        return await GetAsync<PaginatedResponse<CursoDTO>>(endpoint);
    }
}
```

### Configuración de DI (Program.cs)

```csharp
// Configuración de ApiSettings
builder.Services.Configure<ApiSettings>(builder.Configuration.GetSection("ApiSettings"));

// Registrar HttpClient con los servicios
builder.Services.AddHttpClient<ICursosApiService, CursosApiService>();
builder.Services.AddHttpClient<IProfesoresApiService, ProfesoresApiService>();
```

---

## 🎨 Manejo de Errores (Frontend)

### Helper AJAX Centralizado (`ajax-helper.js`)

Todos los AJAX pasan por `AjaxHelper.request()` que:
1. **Valida respuestas**: Si `success === false`, muestra error
2. **Maneja HTTP errors**: 400, 401, 403, 404, 500, etc.
3. **Muestra notificaciones**: Con SweetAlert2
4. **Parsea errores**: Extrae mensajes detallados del servidor

### Ejemplo de uso:

```javascript
AjaxHelper.request({
    url: '/Cursos/Create',
    type: 'POST',
    data: { nombre: 'Nuevo Curso', ... },
    success: function(response) {
        if (response.success) {
            table.ajax.reload(); // Recarga tabla
        }
    },
    error: function(xhr) {
        // Errores HTTP se manejan automáticamente
    }
});
```

### Respuesta de ejemplo (API):

```json
{
  "success": true,
  "message": "Curso creado exitosamente",
  "data": { ... }
}
```

---

## 🔐 Seguridad

- Las URLs de la API se cargan desde `appsettings.json` (no hardcodeadas)
- HTTPS habilitado por defecto
- CORS puede configurarse en el backend si es necesario
- Los errores sensibles del servidor NO se exponen en el frontend

---

## 📦 Dependencias Externas Utilizadas

| Paquete | Versión | Uso |
|---------|---------|-----|
| Microsoft.Extensions.Http | 10.0.1 | HttpClient factory |
| Microsoft.Extensions.Options | 10.0.1 | Configuración inyectable |
| Bootstrap (CDN) | 5.3.0 | Estilos |
| jQuery (CDN) | 3.6.0 | DOM manipulation |
| DataTables (CDN) | 1.13.5 | Tablas dinámicas |
| SweetAlert2 (CDN) | 11 | Notificaciones |

---

## 🐛 Solución de Problemas

### Error: "Unable to connect to the remote server"
**Causa**: El backend no está ejecutándose o la URL es incorrecta.
**Solución**: 
- Verifica que el backend esté ejecutándose en `https://localhost:5001`
- Edita `appsettings.json` con la URL correcta

### Error: "The type or namespace name 'IOptions<>' could not be found"
**Causa**: Falta el paquete NuGet `Microsoft.Extensions.Options`
**Solución**: 
```bash
cd src/Frontend.Infrastructure
dotnet add package Microsoft.Extensions.Options
```

### Las tablas no cargan datos
**Causa**: El API retorna formato inesperado
**Solución**: Abre la consola del navegador (F12) y verifica las respuestas AJAX

---

## 📝 Notas Importantes

1. **No incluye global.json** - Compatible con .NET 8.x
2. **Sin Docker** - Ejecuta directamente con `dotnet run`
3. **Clean Architecture** - Cada capa tiene responsabilidades claras
4. **Extensible** - Fácil agregar nuevas entidades/endpoints
5. **Testeable** - Interfaces permiten pruebas unitarias

---

## 🤝 Contribuciones

Este proyecto fue generado como ejercicio de evaluación. Para mejoras futuras:
- Agregar autenticación/autorización
- Implementar pruebas unitarias
- Agregar logging centralizado
- Implementar cache de clientes HTTP

---

## 📄 Licencia

Este proyecto es de demostración y está disponible bajo licencia MIT.

---

## 👨‍💻 Autor

Generado automáticamente para ExamenFe - Evaluación técnica ASP.NET Core MVC

**Versión**: 1.0  
**Fecha**: 26 de diciembre de 2025  
**Target Framework**: .NET 8.0