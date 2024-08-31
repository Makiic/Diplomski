using Diplomski.Context;
using Diplomski.Models;
using Diplomski.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Diplomski.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActivitiesController : ControllerBase
    {
        private readonly ActivityService _activityService;
        private readonly Contexts _context; // Assuming you have a DbContext for data access

        public ActivitiesController(ActivityService activityService, Contexts context)
        {
            _activityService = activityService;
            _context = context;
        }

        [HttpGet("daily-stats")]
        public async Task<IActionResult> GetDailyStats(int userId)
        {
            var activities = await _context.Activities
                .Where(a => a.UserId == userId )
                .ToListAsync();

            var stats = _activityService.GetDailyActivityStatsByUser(activities);
            return Ok(stats);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateActivity([FromBody] Activity activity)
        {
            if (activity == null)
            {
                return BadRequest("Activity data is required.");
            }

            // Optional: Add additional validation logic here

            _context.Activities.Add(activity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDailyStats), new { userId = activity.UserId }, activity);
        }
        [HttpGet("activities/{userId}")]
        public async Task<IActionResult> GetActivitiesByUserId(int userId)
        {
            var activities = await _context.Activities
                .Where(a => a.UserId == userId)
                .ToListAsync();

            if (activities == null || !activities.Any())
            {
                return NotFound("No activities found for the specified user.");
            }

            var routeIds = activities.Select(a => a.RouteId).Distinct().ToList();
            var routes = await _context.Routes
                .Where(r => routeIds.Contains(r.Id))
                .ToListAsync();

            var result = activities.Select(activity => new
            {
                Activity = activity,
                Route = routes.FirstOrDefault(route => route.Id == activity.RouteId)
            }).ToList();

            return Ok(result);
        }




    }

}
