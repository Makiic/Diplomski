// activityroute.model.ts
export interface Activity {
    id: number;
    name: string;
    description: string;
    type: Type; // or your specific enum type
    pace: string; // if pace is a string, this should be correct
    startTime: string;
    endTime: string;
    steps: number;
    calories: number;
    userId: number;
    routeId: number;

    
  }
  export enum Type {
    RUNNING =0,
    CYCLING=1 ,
    WEIGHTLIFT=2,
    WALKING=3,
    HIKING=4,
    PILATES=5,
    HIIT=6,
    SWIMMING=7
  }
  
  export interface Route {
    Id: number;
    Name: string;
    startPoint: string;
    endPoint: string;
    distance: number;
  }
  
  export interface ActivityWithRoute {
    activity: Activity;
    route: Route;
  }
  