namespace Frontend.Application.DTOs.Cursos
{
    public class CursoDTO
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string? Codigo { get; set; }
        public int IdProfesor { get; set; }
        public bool Activo { get; set; }
    }
}
