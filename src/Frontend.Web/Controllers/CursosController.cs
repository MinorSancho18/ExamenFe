using Microsoft.AspNetCore.Mvc;
using Frontend.Application.Services.Interfaces;
using Frontend.Application.DTOs.Cursos;

namespace Frontend.Web.Controllers
{
    public class CursosController : Controller
    {
        private readonly ICursosApiService _cursosApiService;
        private readonly IProfesoresApiService _profesoresApiService;

        public CursosController(ICursosApiService cursosApiService, IProfesoresApiService profesoresApiService)
        {
            _cursosApiService = cursosApiService;
            _profesoresApiService = profesoresApiService;
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetCursos(int page = 1, int pageSize = 10, int? idProfesor = null)
        {
            var response = await _cursosApiService.GetCursosAsync(page, pageSize, idProfesor);
            return Json(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _cursosApiService.GetCursoByIdAsync(id);
            return Json(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CrearCursoCommand command)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Datos inválidos", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }

            var response = await _cursosApiService.CrearCursoAsync(command);
            return Json(response);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ActualizarCursoCommand command)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Datos inválidos", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }

            var response = await _cursosApiService.ActualizarCursoAsync(command);
            return Json(response);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _cursosApiService.EliminarCursoAsync(id);
            return Json(response);
        }

        [HttpPatch]
        public async Task<IActionResult> CambiarEstado([FromBody] CambiarEstadoCursoCommand command)
        {
            var response = await _cursosApiService.CambiarEstadoCursoAsync(command);
            return Json(response);
        }
    }
}
