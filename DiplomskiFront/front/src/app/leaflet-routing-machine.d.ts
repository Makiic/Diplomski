declare module 'leaflet-routing-machine' {
    import * as L from 'leaflet';
  
    namespace L.Routing {
      interface LineOptions {
        styles?: L.PathOptions[];
        extendToWaypoints?: boolean;
        missingRouteTolerance?: number;
      }
  
      class Control {
        constructor(options: ControlOptions);
        addTo(map: L.Map): this;
      }
  
      interface ControlOptions {
        waypoints: L.LatLng[];
        routeWhileDragging?: boolean;
        lineOptions?: LineOptions;
      }
    }
  
    export = L.Routing;
  }
  