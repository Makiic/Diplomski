using Diplomski.Context;
using Diplomski.DTO;
using Diplomski.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Diplomski.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _config;
        public readonly Contexts _userContext;

        public UserController(IConfiguration config, Contexts userContext)
        {
            _config = config;
            _userContext = userContext;

        }



        [HttpPost("CreateUser")]
        public IActionResult Create(User user)
        {
            if (_userContext.Users.Where(u => u.Email == user.Email).FirstOrDefault() != null)
            {
                return Ok("Already Exists");
            }

            _userContext.Add(user);
            _userContext.SaveChanges();

            return Ok("Succes from Create Method");
        }


        [HttpGet("GetUserById/{id}")]
        public IActionResult GetUserById(int id)
        {
            var user = _userContext.GetUserById(id);
            return Ok(user);
        }
        [HttpGet("{userId}")]
        public async Task<ActionResult<User>> GetUserClubs(int userId)
        {
            var user = await _userContext.Users
                .Include(u => u.Clubs)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }


        [HttpPost("{userId}/join-club/{clubId}")]
        public async Task<IActionResult> JoinClub(int userId, int clubId)
        {
            var user = await _userContext.Users
                                     .Include(u => u.Clubs)
                                     .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            var club = await _userContext.Clubs.FindAsync(clubId);
            if (club == null)
            {
                return NotFound(new { message = "Club not found." });
            }

            if (user.Clubs == null)
            {
                user.Clubs = new List<Club>();
            }

            if (user.Clubs.Any(c => c.Id == clubId))
            {
                return BadRequest(new { message = "User is already a member of this club." });
            }

            user.Clubs.Add(club);

            await _userContext.SaveChangesAsync();

            return Ok(new { message = "Joined the club successfully." });
        }

    }






}





