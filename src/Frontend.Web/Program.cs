using Frontend.Application.Services.Interfaces;
using Frontend.Infrastructure.Settings;
using Frontend.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configuración de ApiSettings desde appsettings.json
builder.Services.Configure<ApiSettings>(builder.Configuration.GetSection("ApiSettings"));

// Registrar HttpClient para servicios API
builder.Services.AddHttpClient<ICursosApiService, CursosApiService>();
builder.Services.AddHttpClient<IProfesoresApiService, ProfesoresApiService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Profesores/Index");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Profesores}/{action=Index}/{id?}");

app.Run();
