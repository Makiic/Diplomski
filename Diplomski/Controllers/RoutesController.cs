using Diplomski.Context;
using Diplomski.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Route = Diplomski.Models.Route;

namespace Diplomski.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoutesController : ControllerBase
    {
        private readonly Contexts _context;

        public RoutesController(Contexts context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRoute([FromBody] Route route)
        {
            if (ModelState.IsValid)
            {
                _context.Routes.Add(route);
                await _context.SaveChangesAsync();
                return Ok(route);
            }

            return BadRequest(ModelState);
        }

        [HttpGet]
        public async Task<IActionResult> GetRoutes()
        {
            var routes = await _context.Routes.Include(r => r.Aktivnosti).ToListAsync();
            return Ok(routes);
        }
       
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoute(int id)
        {
            // Find the route by ID
            var route = await _context.Routes.FindAsync(id);
            if (route == null)
            {
                return NotFound();
            }

            // Remove the route from the context
            _context.Routes.Remove(route);

            // Save changes to the database
            await _context.SaveChangesAsync();

            return NoContent(); // HTTP 204 No Content
        }
        [HttpPost("{id}/rate")]
        public async Task<IActionResult> RateRoute(int id, [FromBody] int rating)
        {
            // Check if the rating is within the valid range
            if (rating < 1 || rating > 5)
            {
                return BadRequest("Rating must be between 1 and 5.");
            }

            // Retrieve the route from the database
            var route = await _context.Routes.FindAsync(id);
            if (route == null)
            {
                return NotFound("Route not found.");
            }

            // Retrieve the current user (Assuming you're using some form of authentication)
           
                    // Set the route rating
                    route.Rate = rating;
                    await _context.SaveChangesAsync();
                    return Ok(route);
             

        }
    }

}

