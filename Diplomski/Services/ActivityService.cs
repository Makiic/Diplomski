
      using Diplomski.Models;
using System.Collections.Generic;
using System.Linq;

namespace Diplomski.Services
{
    public class ActivityService
    {
        private readonly RouteService _routeService; // Assuming you have a service to get route distances

        public ActivityService(RouteService routeService)
        {
            _routeService = routeService;
        }

        public Dictionary<DateTime, Dictionary<string, double>> GetDailyActivityStatsByUser(List<Activity> activities)
        {
            var dailyStats = activities
                .GroupBy(a => a.StartTime.Date)
                .ToDictionary(
                    g => g.Key,
                    g => new Dictionary<string, double>
                    {
                        { "TotalSteps", g.Sum(a => a.Steps) },
                        { "TotalCalories", g.Sum(a => a.Calories) },
                        { "AveragePace", g.Average(a => ParsePace(a.Pace)) },
                        { "ActivityCount", g.Count() },
                        { "TotalDistance", g.Sum(a => _routeService.GetDistanceByRouteId(a.RouteId)) }
                    });

            return dailyStats;
        }

        private double ParsePace(string pace)
        {
            if (string.IsNullOrEmpty(pace))
                return 0;

            var parts = pace.Split(':');
            if (parts.Length != 2)
                return 0;

            if (int.TryParse(parts[0], out var minutes) && int.TryParse(parts[1], out var seconds))
                return minutes + seconds / 60.0;

            return 0;
        }
    }


}


