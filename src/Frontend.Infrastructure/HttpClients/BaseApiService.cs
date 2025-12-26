using System.Net.Http.Json;
using Frontend.Application.DTOs.Common;
using Microsoft.Extensions.Options;
using Frontend.Infrastructure.Settings;
using System.Text.Json;

namespace Frontend.Infrastructure.HttpClients
{
    public abstract class BaseApiService
    {
        protected readonly HttpClient _httpClient;
        protected readonly ApiSettings _apiSettings;
        protected readonly JsonSerializerOptions _jsonOptions;

        protected BaseApiService(HttpClient httpClient, IOptions<ApiSettings> apiSettings)
        {
            _httpClient = httpClient;
            _apiSettings = apiSettings.Value;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
        }

        protected async Task<ApiResponse<T>> GetAsync<T>(string endpoint)
        {
            try
            {
                var response = await _httpClient.GetAsync(endpoint);
                return await HandleResponse<T>(response);
            }
            catch (Exception ex)
            {
                return new ApiResponse<T>
                {
                    Success = false,
                    Message = $"Error en la solicitud: {ex.Message}",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        protected async Task<ApiResponse<T>> PostAsync<T>(string endpoint, object? data = null)
        {
            try
            {
                HttpResponseMessage response;
                if (data != null)
                {
                    response = await _httpClient.PostAsJsonAsync(endpoint, data, _jsonOptions);
                }
                else
                {
                    response = await _httpClient.PostAsync(endpoint, null);
                }
                return await HandleResponse<T>(response);
            }
            catch (Exception ex)
            {
                return new ApiResponse<T>
                {
                    Success = false,
                    Message = $"Error en la solicitud: {ex.Message}",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        protected async Task<ApiResponse<T>> PutAsync<T>(string endpoint, object? data = null)
        {
            try
            {
                HttpResponseMessage response;
                if (data != null)
                {
                    response = await _httpClient.PutAsJsonAsync(endpoint, data, _jsonOptions);
                }
                else
                {
                    response = await _httpClient.PutAsync(endpoint, null);
                }
                return await HandleResponse<T>(response);
            }
            catch (Exception ex)
            {
                return new ApiResponse<T>
                {
                    Success = false,
                    Message = $"Error en la solicitud: {ex.Message}",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        protected async Task<ApiResponse<T>> PatchAsync<T>(string endpoint, object? data = null)
        {
            try
            {
                var content = data != null ? JsonContent.Create(data, options: _jsonOptions) : null;
                var request = new HttpRequestMessage(HttpMethod.Patch, endpoint) { Content = content };
                var response = await _httpClient.SendAsync(request);
                return await HandleResponse<T>(response);
            }
            catch (Exception ex)
            {
                return new ApiResponse<T>
                {
                    Success = false,
                    Message = $"Error en la solicitud: {ex.Message}",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        protected async Task<ApiResponse<T>> DeleteAsync<T>(string endpoint)
        {
            try
            {
                var response = await _httpClient.DeleteAsync(endpoint);
                return await HandleResponse<T>(response);
            }
            catch (Exception ex)
            {
                return new ApiResponse<T>
                {
                    Success = false,
                    Message = $"Error en la solicitud: {ex.Message}",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        private async Task<ApiResponse<T>> HandleResponse<T>(HttpResponseMessage response)
        {
            var content = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                try
                {
                    if (string.IsNullOrEmpty(content))
                    {
                        return new ApiResponse<T>
                        {
                            Success = true,
                            Message = "Operación completada"
                        };
                    }

                    var apiResponse = JsonSerializer.Deserialize<ApiResponse<T>>(content, _jsonOptions);
                    return apiResponse ?? new ApiResponse<T> { Success = true, Data = default };
                }
                catch
                {
                    // Si la respuesta no es un ApiResponse, intenta deserializar directamente como T
                    try
                    {
                        var data = JsonSerializer.Deserialize<T>(content, _jsonOptions);
                        return new ApiResponse<T>
                        {
                            Success = true,
                            Message = "Operación completada",
                            Data = data
                        };
                    }
                    catch (Exception ex)
                    {
                        return new ApiResponse<T>
                        {
                            Success = false,
                            Message = $"Error deserializando respuesta: {ex.Message}",
                            Errors = new List<string> { ex.Message }
                        };
                    }
                }
            }

            // Manejo de errores HTTP
            var errors = new List<string>();
            try
            {
                var errorResponse = JsonSerializer.Deserialize<dynamic>(content, _jsonOptions);
                if (errorResponse != null)
                {
                    errors.Add(content);
                }
            }
            catch
            {
                errors.Add(content);
            }

            return new ApiResponse<T>
            {
                Success = false,
                Message = $"Error HTTP {(int)response.StatusCode}: {response.ReasonPhrase}",
                Errors = errors
            };
        }
    }
}
