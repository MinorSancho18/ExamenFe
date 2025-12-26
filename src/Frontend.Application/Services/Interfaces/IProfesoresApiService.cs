using Frontend.Application.DTOs.Profesores;
using Frontend.Application.DTOs.Common;

namespace Frontend.Application.Services.Interfaces
{
    public interface IProfesoresApiService
    {
        Task<ApiResponse<PaginatedResponse<ProfesorDTO>>> GetProfesoresAsync(int page, int pageSize);
        Task<ApiResponse<ProfesorDTO>> GetProfesorByIdAsync(int id);
        Task<ApiResponse<ProfesorDTO>> CrearProfesorAsync(CrearProfesorCommand command);
        Task<ApiResponse<ProfesorDTO>> ActualizarProfesorAsync(ActualizarProfesorCommand command);
        Task<ApiResponse<bool>> EliminarProfesorAsync(int id);
    }
}
