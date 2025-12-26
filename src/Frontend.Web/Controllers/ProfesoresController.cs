using Microsoft.AspNetCore.Mvc;
using Frontend.Application.Services.Interfaces;
using Frontend.Application.DTOs.Profesores;

namespace Frontend.Web.Controllers
{
    public class ProfesoresController : Controller
    {
        private readonly IProfesoresApiService _profesoresApiService;

        public ProfesoresController(IProfesoresApiService profesoresApiService)
        {
            _profesoresApiService = profesoresApiService;
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetProfesores(int page = 1, int pageSize = 10)
        {
            var response = await _profesoresApiService.GetProfesoresAsync(page, pageSize);
            return Json(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _profesoresApiService.GetProfesorByIdAsync(id);
            return Json(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CrearProfesorCommand command)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Datos inválidos", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }

            var response = await _profesoresApiService.CrearProfesorAsync(command);
            return Json(response);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ActualizarProfesorCommand command)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Datos inválidos", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }

            var response = await _profesoresApiService.ActualizarProfesorAsync(command);
            return Json(response);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _profesoresApiService.EliminarProfesorAsync(id);
            return Json(response);
        }
    }
}
