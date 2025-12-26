namespace Frontend.Application.DTOs.Profesores
{
    public class CrearProfesorCommand
    {
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
        public int Edad { get; set; }
        public double Salario { get; set; }
    }
}
