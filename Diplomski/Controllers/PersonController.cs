using Diplomski.Context;
using Diplomski.DTO; // Import the Identity namespace
using Diplomski.MailUtil;
using Diplomski.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
namespace Diplomski.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IPasswordHasher<Person> _passwordHasher;
        public readonly Contexts _context;
        private readonly IWebHostEnvironment _environment;
        private readonly IMailService _mailService;
        public PersonController(IConfiguration config, Contexts Context, IMailService mailService, IWebHostEnvironment environment, IPasswordHasher<Person> passwordHasher)
        {
            _config = config;
            _environment = environment ?? throw new ArgumentNullException(nameof(environment));
            _context = Context;
            _mailService = mailService;
            _passwordHasher = passwordHasher;
        }

        private static Random random = new Random();

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        [HttpPost]
        public IActionResult CreatePerson([FromBody] PersonDto personDto)
        {
            if (personDto == null)
            {
                return BadRequest("Person data is required.");
            }

            // Validate DTO
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                return BadRequest(new { Errors = errors });
            }

            // Map DTO to Entity
            var person = new Person
            {
                Email = personDto.Email,
                Name = personDto.Name,
                Surname = personDto.Surname,
                City = personDto.City,
                Country = personDto.Country,
                Phone = personDto.Phone,
                ProfileImageUrl = personDto.ProfileImageUrl,
                ActivationLink = RandomString(10),
                MemberSince = DateTime.UtcNow,
                IsActivated = false
            };

            // Hash the password
            var hashedPassword = _passwordHasher.HashPassword(person, personDto.Password);

            // Store the hashed password
            person.Password = hashedPassword;

            // Save to database
            _context.Persons.Add(person);
            _context.SaveChanges();

            // Create User
            var user = new User
            {
                Email = person.Email,
                Password = hashedPassword, // Store the hashed password
                Role = Role.USER,
                Name = person.Name,
                Surname = person.Surname
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            // Send activation email
            _mailService.SendActivationMail(person);

            return Ok(new { message = "Registration successful. Please check your email." });
        }


        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileUrl = $"/images/{file.FileName}";

            return Ok(new { FileUrl = fileUrl });
        }



        [HttpPut("ActivateProfile/{link}")]
        public ActionResult<Person> ActivateUser([FromRoute] string link)
        {
            var person = _context.GetUserWithActivationLink(link);

            if (person == null)
            {
                return NotFound();
            }
            person.IsActivated = true;


            _context.Persons.Entry(person).CurrentValues.SetValues(person);
            _context.SaveChanges();

            return Ok();
        }


        [HttpGet("GetPersonById/{id}")]
        public IActionResult GetPersonById(int id)
        {
            var user = _context.GetPersonById(id);
            return Ok(user);
        }
        [HttpPut("UpdatePerson/{id}")]
        public IActionResult UpdatePerson(int id, [FromBody] PersonDto updatedPersonDto)
        {
            // Find the Person by UserID
            var person = _context.Persons.FirstOrDefault(p => p.UserID == id);
            if (person == null)
            {
                return NotFound("Person not found");
            }

            // Find the User by the same UserID
            var user = _context.Users.FirstOrDefault(u => u.Id == person.UserID);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Update Person properties
            person.Name = updatedPersonDto.Name;
            person.Surname = updatedPersonDto.Surname;
            person.Email = updatedPersonDto.Email;
            person.City = updatedPersonDto.City;
            person.Country = updatedPersonDto.Country;
            person.Phone = updatedPersonDto.Phone;

            // Check if password is provided and needs to be updated
            if (!string.IsNullOrEmpty(updatedPersonDto.Password))
            {
                // Hash the new password
                var hashedPassword = _passwordHasher.HashPassword(person, updatedPersonDto.Password);

                // Update Person and User properties with the hashed password
                person.Password = hashedPassword;
                user.Password = hashedPassword;
            }

            // Update User properties with the same fields from Person
            user.Name = updatedPersonDto.Name;
            user.Surname = updatedPersonDto.Surname;
            user.Email = updatedPersonDto.Email;

            // Save changes to both entities
            _context.SaveChanges();

            return Ok("Person and related user updated successfully");
        }


        [HttpPut("{id}")]
        public IActionResult ChangePhoto(int id, [FromBody] Person updatedPerson)
        {
            // Find the Person by UserID
            var person = _context.Persons.FirstOrDefault(p => p.UserID == id);
            if (person == null)
            {
                return NotFound("Person not found");
            }



            // Update Person properties
            person.ProfileImageUrl = updatedPerson.ProfileImageUrl;


            // Save changes to both entities
            _context.SaveChanges();

            return Ok("Person and related user updated successfully");
        }

        [HttpPut("ChangePassword/{id}")]
        public IActionResult ChangePassword(int id, [FromBody] ChangePasswordDto changePasswordDto)
        {
            // Find the Person by UserID
            var person = _context.Persons.FirstOrDefault(p => p.UserID == id);
            if (person == null)
            {
                return NotFound("Person not found");
            }

            // Find the User by the same UserID
            var user = _context.Users.FirstOrDefault(u => u.Id == person.UserID);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Validate the old password (if required)
            var oldPasswordIsValid = _passwordHasher.VerifyHashedPassword(person, person.Password, changePasswordDto.OldPassword);
            if (oldPasswordIsValid == PasswordVerificationResult.Failed)
            {
                return BadRequest("Old password is incorrect");
            }

            // Hash the new password
            var hashedNewPassword = _passwordHasher.HashPassword(person, changePasswordDto.NewPassword);

            // Update Person and User properties with the new hashed password
            person.Password = hashedNewPassword;
            user.Password = hashedNewPassword;

            // Save changes to both entities
            _context.SaveChanges();

            return Ok("Password updated successfully");
        }

    }


}



