using Diplomski.Context;

namespace Diplomski.Services
{
    public class RouteService
    {
        private readonly Contexts _context;
        public RouteService(Contexts context) 
        {
            _context = context;
        }
        public double GetDistanceByRouteId(int routeId)
        {
            var distance = _context.Routes.Where(r => r.Id == routeId).Select(r=> r.Distance).FirstOrDefault();
            return distance;


        }
    }
}
