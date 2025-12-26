# 🔧 SOLUCIÓN DE PROBLEMAS & DEBUG

## 📋 Verificación Pre-ejecución

### 1. Verificar .NET 8.x
```bash
$ dotnet --version
10.0.100  ✅ (Compatible, también soporta .NET 8)

# Si tienes solo .NET 7 o menor:
# Necesitas instalar .NET 8.x
```

### 2. Verificar puertos disponibles
```bash
# En Linux/Mac:
lsof -i :7260
lsof -i :5001

# En Windows:
netstat -ano | findstr ":7260"
netstat -ano | findstr ":5001"
```

### 3. Verificar backend API
```bash
# El backend DEBE estar ejecutándose en:
https://localhost:5001

# Prueba en navegador:
curl -k https://localhost:5001/api/cursos?page=1&pageSize=10
# Debe retornar JSON (no 404 o conexión rechazada)
```

---

## ⚠️ Errores Comunes y Soluciones

### Error 1: "Unable to connect to the remote server"

**Síntoma:**
```
AjaxError in browser console:
"Unable to connect to the remote server https://localhost:5001"
```

**Causas:**
- Backend API no está ejecutándose
- URL en appsettings.json es incorrecta
- Firewall bloqueando puerto 5001

**Solución:**
```bash
# 1. Verificar que backend está running:
cd ExamenProcomerBackend
dotnet run

# 2. Editar appsettings.json con URL correcta:
{
  "ApiSettings": {
    "BaseUrl": "http://localhost:5000"  // Si es HTTP
  }
}

# 3. Reiniciar frontend:
cd ../ExamenFe/src/Frontend.Web
dotnet run
```

---

### Error 2: "The type or namespace name 'IOptions<>' could not be found"

**Síntoma:**
```
Compilation error:
CS0246: The type or namespace name 'IOptions<>' could not be found
```

**Causa:**
Falta paquete `Microsoft.Extensions.Options` en Infrastructure

**Solución:**
```bash
cd src/Frontend.Infrastructure
dotnet add package Microsoft.Extensions.Options
dotnet restore
cd ../..
dotnet build
```

---

### Error 3: Tabla no carga datos

**Síntoma:**
```
DataTable muestra "No data available in table"
o tabla permanece vacía aunque no hay errores
```

**Verificación:**
1. Abre F12 en navegador (Inspector)
2. Ve a pestaña "Network"
3. Busca la petición GET `/Cursos/GetCursos`
4. Verifica:
   - Status code: ¿200 OK?
   - Response: ¿JSON válido?
   - Headers: ¿Content-Type: application/json?

**Causas Posibles:**
- Backend retorna formato diferente
- API retorna error 404 o 500
- Mala interpretación de respuesta en cursos.js

**Solución:**
```javascript
// En F12 Console, ejecuta:
fetch('/Cursos/GetCursos?page=1&pageSize=10')
  .then(r => r.json())
  .then(d => console.log(d))  // Ver estructura completa

// Verifica que respuesta tenga estructura:
{
  "data": {
    "items": [ /* array de cursos */ ],
    "totalItems": 0,
    "page": 1,
    "pageSize": 10,
    "totalPages": 0
  }
}
```

---

### Error 4: Modal no abre o formulario no limpia

**Síntoma:**
```
Click en botón "Nuevo" pero modal no se abre
o modal abre con datos previos
```

**Causa:**
Problema en jQuery o Bootstrap no cargado

**Solución:**
```bash
# Asegúrate de que hay internet (CDN)
# O carga localmente:
# 1. Abre Views/Shared/_Layout.cshtml
# 2. Verifica que CDN links están presentes
# 3. Abre F12 → Network → verifica que se cargan

# Si CDN no funciona, descarga localmente:
# - Bootstrap
# - jQuery
# - DataTables
# - SweetAlert2
# Y actualiza paths en _Layout.cshtml
```

---

### Error 5: CORS bloqueando peticiones

**Síntoma:**
```
Console error:
"Access to XMLHttpRequest at 'https://localhost:5001/...'
from origin 'https://localhost:7260' has been blocked by CORS policy"
```

**Solución:**
En el backend (ExamenProcomerBackend), habilitar CORS:

```csharp
// Program.cs del backend
var builder = WebApplicationBuilder.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();
app.UseCors("AllowAll");  // Antes de MapEndpoints
```

---

### Error 6: Certificado HTTPS inválido en desarrollo

**Síntoma:**
```
HTTPS connection refused
NET::ERR_CERT_INVALID
```

**Solución Desarrollo:**
```bash
# Confiar en certificado self-signed:
dotnet dev-certs https --trust

# O ejecutar sin HTTPS:
cd src/Frontend.Web
dotnet run --launch-profile http

# URL: http://localhost:5260
```

---

## 🔍 Debugging Activo

### Activar logs en Console

Editar `src/Frontend.Web/Program.cs`:
```csharp
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.SetMinimumLevel(LogLevel.Debug);
});
```

### Ver peticiones HTTP

En `ajax-helper.js`, descomentar:
```javascript
console.log('Cargando...');  // showLoading()
console.log('Carga completada');  // hideLoading()
```

O usar:
```javascript
// En browser F12 Console:
fetch('https://localhost:5001/api/cursos?page=1&pageSize=10', {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(d => console.log('Data:', d))
.catch(e => console.error('Error:', e));
```

### Inspeccionar ModelState en Server

En `CursosController.cs`:
```csharp
[HttpPost]
public async Task<IActionResult> Create([FromBody] CrearCursoCommand command)
{
    // Debugging
    System.Diagnostics.Debug.WriteLine($"ModelState.IsValid: {ModelState.IsValid}");
    foreach (var state in ModelState.Values)
    {
        foreach (var error in state.Errors)
        {
            System.Diagnostics.Debug.WriteLine($"Error: {error.ErrorMessage}");
        }
    }
    
    // ... resto del código
}
```

---

## 📊 Ver Estado de Servicios

### Verificar DI Configuration
En `Program.cs` después de `builder.Build()`:
```csharp
var app = builder.Build();

// Verificar que servicios fueron registrados
var cursoService = app.Services.GetRequiredService<ICursosApiService>();
var profesorService = app.Services.GetRequiredService<IProfesoresApiService>();

Console.WriteLine("✅ CursosApiService registrado");
Console.WriteLine("✅ ProfesoresApiService registrado");
```

### Ver URLs Configuradas
```csharp
var options = app.Services.GetRequiredService<IOptions<ApiSettings>>();
Console.WriteLine($"API BaseUrl: {options.Value.BaseUrl}");
```

---

## 🧪 Pruebas Manuales

### Test 1: GET Cursos (Listar)
```bash
curl -k -X GET \
  "https://localhost:5001/api/cursos?page=1&pageSize=10" \
  -H "Accept: application/json"
```

### Test 2: POST Curso (Crear)
```bash
curl -k -X POST \
  "https://localhost:5001/api/cursos" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Curso",
    "codigo": "TEST-001",
    "fechaInicio": "2025-01-15T09:00:00",
    "fechaFin": "2025-06-15T18:00:00",
    "idProfesor": 1
  }'
```

### Test 3: GET Curso (Obtener por ID)
```bash
curl -k -X GET \
  "https://localhost:5001/api/cursos/1" \
  -H "Accept: application/json"
```

### Test 4: PUT Curso (Actualizar)
```bash
curl -k -X PUT \
  "https://localhost:5001/api/cursos/1" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "nombre": "Curso Actualizado",
    "codigo": "UPD-001",
    "fechaInicio": "2025-01-15T09:00:00",
    "fechaFin": "2025-06-15T18:00:00",
    "idProfesor": 1
  }'
```

### Test 5: DELETE Curso
```bash
curl -k -X DELETE \
  "https://localhost:5001/api/cursos/1" \
  -H "Accept: application/json"
```

---

## 📈 Monitoreo en Tiempo Real

### Ver logs en tiempo real
```bash
# En ventana separada:
cd src/Frontend.Web
dotnet run 2>&1 | grep -E "info:|warn:|error:"

# O con más detalle:
dotnet run --loglevel Debug
```

### Ver peticiones en red
```
1. Abre F12 en navegador
2. Ve a pestaña "Network"
3. Realiza operación (crear, editar, eliminar)
4. Verifica que aparezcan peticiones
5. Revisa Status Code y Response
```

### Verificar estado de la tabla
```javascript
// En F12 Console:
$('#tableCursos').DataTable();  // Accede a instancia
// Ver configuración, datos, etc.
```

---

## 🔄 Reconstruir Proyecto Limpio

Si nada funciona:
```bash
# 1. Limpiar completamente
cd /workspaces/ExamenFe
dotnet clean
rm -rf src/*/bin src/*/obj

# 2. Restaurar dependencias
dotnet restore

# 3. Compilar fresh
dotnet build

# 4. Ejecutar
cd src/Frontend.Web
dotnet run

# 5. Test en navegador
# Abre: https://localhost:7260/Cursos
```

---

## 📞 Checklist Final

Antes de reportar bug:

- [ ] Backend API está ejecutándose en `https://localhost:5001`
- [ ] appsettings.json tiene URL correcta
- [ ] `dotnet build` ejecuta sin errores
- [ ] F12 Console no muestra CORS errors
- [ ] F12 Network muestra peticiones 200 OK
- [ ] Certificado HTTPS es válido o confias en él
- [ ] .NET 8.x está instalado
- [ ] Puerto 7260 está disponible
- [ ] Clearing browser cache (Ctrl+Shift+Del)
- [ ] Reiniciando aplicación (`dotnet run` fresh)

---

## 🎯 Conclusion

Si aún hay problemas después de esto:
1. Verifica logs en consola
2. Abre F12 para ver errores JavaScript
3. Revisa Network tab para peticiones fallidas
4. Confirma backend está retornando JSON válido
5. Verifica URLs en appsettings.json

¡El proyecto está diseñado para ser robusto!
