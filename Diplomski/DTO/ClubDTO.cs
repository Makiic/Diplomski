using Diplomski.Models;

namespace Diplomski.DTO
{
    public class ClubDTO
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<UserDto> Members { get; set; } = new List<UserDto>();
        public string Picture { get; set; }
    }
}
