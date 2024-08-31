using Diplomski.Context;
using Diplomski.DTO;
using Diplomski.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Diplomski.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly Contexts _context;
        private readonly IPasswordHasher<Person> _passwordHasher;

        public AuthController(Contexts context, IConfiguration config, IPasswordHasher<Person> passwordHasher)
        {
            _context = context;
            _config = config;
            _passwordHasher = passwordHasher;
        }


        [HttpPost("login")]
        public IActionResult Login(LoginDTO loginDTO)
        {
            if (loginDTO == null || string.IsNullOrEmpty(loginDTO.Email) || string.IsNullOrEmpty(loginDTO.Password))
            {
                return BadRequest("Invalid client request");
            }

            var person = _context.Persons.FirstOrDefault(p => p.Email == loginDTO.Email);
            if (person == null)
            {
                return BadRequest("User not found");
            }

            // Log details
            Console.WriteLine($"Stored Hash: {person.Password}");
            Console.WriteLine($"Input Password: {loginDTO.Password}");

            
                // Verify the password
                var result = _passwordHasher.VerifyHashedPassword(person, person.Password, loginDTO.Password);
                if (result != PasswordVerificationResult.Success)
                {
                    return BadRequest("Invalid password");
                }

                if (!person.IsActivated)
                {
                    return BadRequest("Account not activated");
                }
            Claim[] claims = new[]
                    {
                new Claim(JwtRegisteredClaimNames.Sub, "hkz2Ba9cf2Q4lPjAf6mS"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                new Claim("Id",person.UserID.ToString()),
                new Claim("Email",person.Email)
            };

            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("zxzxzxzxzxrltCPJ9e6jzxczckCq5nrPP5A"));
            SigningCredentials signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            JwtSecurityToken token = new JwtSecurityToken("bOH8NLMXtivXMrB6c9ED", "wEoprCagCl0G5ySSfZxA", claims, expires: DateTime.UtcNow.AddDays(1), signingCredentials: signIn);
            string accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            TokenDTO tokenDTO = new TokenDTO() { Token = accessToken };
            return Ok(tokenDTO);
        }
    }



}

