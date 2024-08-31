using System.ComponentModel.DataAnnotations;

namespace Diplomski.Models
{
    public class Route
    {
        [Key]
        public int Id { get; set; }
        public string StartPoint { get; set; }
        public string EndPoint { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Name { get; set; }
        public double Distance { get; set; }
        public int? Rate { get; set; }
        public ICollection<Activity> Aktivnosti { get; set; } = new List<Activity>();
    }
}
