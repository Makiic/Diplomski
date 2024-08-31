namespace Diplomski.Models
{
    public enum Role { ADMINISTRATOR, USER, SUBSCRIBED_USER }
    public class User
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public Role Role { get; set; }
        public ICollection<Activity> Activities { get; set; }
        public ICollection<Club> Clubs { get; set; }

    }
}
