import { Route } from "./routes.model";

export interface Activity {
    Id: number;
    Name: string;
    Description: string;
    Type: string;
    Pace: number; // Add this property
    StartTime: string;
    EndTime: string;
    Steps: number;
    Calories: number;
    UserId: number;
   
  }
