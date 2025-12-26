using Frontend.Application.DTOs.Cursos;
using Frontend.Application.DTOs.Common;

namespace Frontend.Application.Services.Interfaces
{
    public interface ICursosApiService
    {
        Task<ApiResponse<PaginatedResponse<CursoDTO>>> GetCursosAsync(int page, int pageSize, int? idProfesor = null);
        Task<ApiResponse<CursoDTO>> GetCursoByIdAsync(int id);
        Task<ApiResponse<CursoDTO>> CrearCursoAsync(CrearCursoCommand command);
        Task<ApiResponse<CursoDTO>> ActualizarCursoAsync(ActualizarCursoCommand command);
        Task<ApiResponse<bool>> EliminarCursoAsync(int id);
        Task<ApiResponse<bool>> CambiarEstadoCursoAsync(CambiarEstadoCursoCommand command);
    }
}
