using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Diplomski.Models
{
    public class Person
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public int UserID { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Surname { get; set; }

        public string City { get; set; } 

        public string Country { get; set; }

        public string Phone { get; set; } 

        public DateTime? MemberSince { get; set; }= DateTime.UtcNow;

        public string ActivationLink { get; set; } = "";

        public bool IsActivated { get; set; } = false;
        public string ProfileImageUrl { get; set; } 

    }
}
