# 🚀 Ejecución Rápida

## Opción 1: Ejecución directa desde la raíz

```bash
# Restaurar y compilar
dotnet restore
dotnet build

# Ejecutar
cd src/Frontend.Web
dotnet run
```

Luego abre: **https://localhost:7260**

---

## Opción 2: Ejecución sin HTTPS (desarrollo)

Si tienes problemas con certificados, edita `launchSettings.json`:

```bash
cd src/Frontend.Web
dotnet run --launch-profile http
```

Luego abre: **http://localhost:5260**

---

## Verificación Pre-lanzamiento

Antes de ejecutar, asegúrate de:

✅ El backend está ejecutándose en `https://localhost:5001`
✅ La URL en `appsettings.json` es correcta
✅ .NET 8.x está instalado: `dotnet --version`
✅ No hay otros procesos en el puerto 7260

---

## Archivos Clave Modificados

| Archivo | Cambio |
|---------|--------|
| `src/Frontend.Web/appsettings.json` | URL del API backend |
| `src/Frontend.Web/Program.cs` | Inyección de dependencias |
| `src/Frontend.Web/Views/Shared/_Layout.cshtml` | Layout actualizado |

---

## Solución rápida de problemas

**Error de compilación:**
```bash
dotnet clean
dotnet restore
dotnet build
```

**Certificado HTTPS invalido:**
- Usa `dotnet run` sin `--configuration Release`
- O configura desarrollo en `launchSettings.json`

**Tabla no carga:**
- Abre F12 en navegador → Consola
- Verifica que el API retorna JSON válido

---

✨ **¡Listo! El proyecto está operacional.**
