namespace Diplomski.Models
{
    public enum Type { RUNNING,CYCLING , WEIGHTLIFT, WALKING, HIKING, PILATES, HIIT,SWIMMING }
    public class Activity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Type type { get; set; } 
        public string Pace { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; } 
        public int Steps { get; set; }
        public int Calories { get; set; }
        public int UserId { get; set; }
        public int RouteId { get; set; }


    }
}
