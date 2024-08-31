 export interface DailyStats {
    [date: string]: {
      TotalSteps: number;
      TotalCalories: number;
      AveragePace: number;
      ActivityCount: number;
      TotalDistance: number; // Ensure this field exists
    };
  }
  