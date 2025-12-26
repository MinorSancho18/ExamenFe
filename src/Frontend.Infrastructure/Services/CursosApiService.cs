using Frontend.Application.DTOs.Cursos;
using Frontend.Application.DTOs.Common;
using Frontend.Application.Services.Interfaces;
using Frontend.Infrastructure.HttpClients;
using Frontend.Infrastructure.Settings;
using Microsoft.Extensions.Options;

namespace Frontend.Infrastructure.Services
{
    public class CursosApiService : BaseApiService, ICursosApiService
    {
        public CursosApiService(HttpClient httpClient, IOptions<ApiSettings> apiSettings)
            : base(httpClient, apiSettings)
        {
        }

        public async Task<ApiResponse<IReadOnlyList<CursoDTO>>> GetCursosAsync(int page, int pageSize, int? idProfesor = null)
        {
            var endpoint = $"{_apiSettings.BaseUrl}/api/cursos?page={page}&pageSize={pageSize}";
            if (idProfesor.HasValue)
                endpoint += $"&idProfesor={idProfesor.Value}";

            var response = await GetAsync<List<CursoDTO>>(endpoint);
            
            if (response.Success && response.Data != null)
            {
                return new ApiResponse<IReadOnlyList<CursoDTO>>
                {
                    Success = response.Success,
                    Message = response.Message,
                    Data = response.Data.AsReadOnly(),
                    Errors = response.Errors
                };
            }

            return new ApiResponse<IReadOnlyList<CursoDTO>>
            {
                Success = response.Success,
                Message = response.Message,
                Data = new List<CursoDTO>().AsReadOnly(),
                Errors = response.Errors
            };
        }

        public async Task<ApiResponse<CursoDTO>> GetCursoByIdAsync(int id)
        {
            var endpoint = $"{_apiSettings.BaseUrl}/api/cursos/{id}";
            return await GetAsync<CursoDTO>(endpoint);
        }

        public async Task<ApiResponse<CursoDTO>> CrearCursoAsync(CrearCursoCommand command)
        {
            var endpoint = $"{_apiSettings.BaseUrl}/api/cursos";
            return await PostAsync<CursoDTO>(endpoint, command);
        }

        public async Task<ApiResponse<CursoDTO>> ActualizarCursoAsync(ActualizarCursoCommand command)
        {
            var endpoint = $"{_apiSettings.BaseUrl}/api/cursos/{command.Id}";
            return await PutAsync<CursoDTO>(endpoint, command);
        }

        public async Task<ApiResponse<bool>> EliminarCursoAsync(int id)
        {
            var endpoint = $"{_apiSettings.BaseUrl}/api/cursos/{id}";
            return await DeleteAsync<bool>(endpoint);
        }

        public async Task<ApiResponse<bool>> CambiarEstadoCursoAsync(CambiarEstadoCursoCommand command)
        {
            var endpoint = $"{_apiSettings.BaseUrl}/api/cursos/{command.Id}/estado";
            return await PatchAsync<bool>(endpoint, command);
        }
    }
}
