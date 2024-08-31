declare module 'openrouteservice-js' {
    export default class OpenRouteService {
      constructor(options: { api_key: string });
  
      directions(options: {
        coordinates: [number[], number[]],
        profile: 'driving-car' | 'cycling-regular' | 'foot-walking' | string,
      }): Promise<any>;
    }
  }
  