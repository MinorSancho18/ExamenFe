using Frontend.Application.DTOs.Profesores;
using Frontend.Application.DTOs.Common;
using Frontend.Application.Services.Interfaces;
using Frontend.Infrastructure.HttpClients;
using Frontend.Infrastructure.Settings;
using Microsoft.Extensions.Options;

namespace Frontend.Infrastructure.Services
{
    public class ProfesoresApiService : BaseApiService, IProfesoresApiService
    {
        public ProfesoresApiService(HttpClient httpClient, IOptions<ApiSettings> apiSettings)
            : base(httpClient, apiSettings)
        {
        }

        public async Task<ApiResponse<IReadOnlyList<ProfesorDTO>>> GetProfesoresAsync(int page, int pageSize)
        {
            var endpoint = $"{_apiSettings.BaseUrl}/api/profesores?page={page}&pageSize={pageSize}";
            var response = await GetAsync<List<ProfesorDTO>>(endpoint);
            
            if (response.Success && response.Data != null)
            {
                return new ApiResponse<IReadOnlyList<ProfesorDTO>>
                {
                    Success = response.Success,
                    Message = response.Message,
                    Data = response.Data.AsReadOnly(),
                    Errors = response.Errors
                };
            }

            return new ApiResponse<IReadOnlyList<ProfesorDTO>>
            {
                Success = response.Success,
                Message = response.Message,
                Data = new List<ProfesorDTO>().AsReadOnly(),
                Errors = response.Errors
            };
        }

        public async Task<ApiResponse<ProfesorDTO>> GetProfesorByIdAsync(int id)
        {
            var endpoint = $"{_apiSettings.BaseUrl}/api/profesores/{id}";
            return await GetAsync<ProfesorDTO>(endpoint);
        }

        public async Task<ApiResponse<ProfesorDTO>> CrearProfesorAsync(CrearProfesorCommand command)
        {
            var endpoint = $"{_apiSettings.BaseUrl}/api/profesores";
            return await PostAsync<ProfesorDTO>(endpoint, command);
        }

        public async Task<ApiResponse<ProfesorDTO>> ActualizarProfesorAsync(ActualizarProfesorCommand command)
        {
            var endpoint = $"{_apiSettings.BaseUrl}/api/profesores/{command.Id}";
            return await PutAsync<ProfesorDTO>(endpoint, command);
        }

        public async Task<ApiResponse<bool>> EliminarProfesorAsync(int id)
        {
            var endpoint = $"{_apiSettings.BaseUrl}/api/profesores/{id}";
            return await DeleteAsync<bool>(endpoint);
        }
    }
}
