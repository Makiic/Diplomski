using Diplomski.Context;
using Diplomski.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Diplomski.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClubsController : ControllerBase
    {
        private readonly IConfiguration _config;
        public readonly Contexts _userContext;

        public ClubsController(IConfiguration config, Contexts userContext)
        {
            _config = config;
            _userContext = userContext;

        }



        [HttpPost]
        public IActionResult Create(Club club)
        {
            _userContext.Add(club);
            _userContext.SaveChanges();

            return Ok("Succes from Create Method");
        }

        [HttpGet]
        public async Task<IActionResult> GetClubs()
        {
            var routes = await _userContext.Clubs.ToListAsync();
            return Ok(routes);
        }


    }

}