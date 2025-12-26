namespace Frontend.Application.DTOs.Cursos
{
    public class CrearCursoCommand
    {
        public string? Nombre { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string? Codigo { get; set; }
        public int IdProfesor { get; set; }
    }
}
