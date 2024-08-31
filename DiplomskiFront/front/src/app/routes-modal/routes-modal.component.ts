import { Component, Inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Route } from '../modules/routes.model';
import { User, UserRole } from '../modules/user.model';
@Component({
  selector: 'app-routes-modal',
  templateUrl: './routes-modal.component.html',
  styleUrls: ['./routes-modal.component.css']
})
export class RoutesModalComponent implements OnInit {
  @Input() routes: any[] = [];
  selectedRating: { [key: number]: number } = {}; 
  user: any;
  currentUser: User | undefined;
  UserRole = UserRole;


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadRoutes();
    
    const token = localStorage.getItem("jwt");

    if (token) {
      // Decode the token to get user information
      this.user = this.jwt_decode(token);
      // Now 'this.user' contains the user information
      console.log("User information:", this.user.Id);
    } else {
      console.error("Token not found in localStorage");
    }
    this.authService.getUserById(Number(this.user.Id)).subscribe({
      next: (result: any) => {  
          this.currentUser = result;
          console.log('Data user:', this.currentUser);
      },
      error: (error) => {
        console.error('API error:', error);
        // Handle error as needed
      }
      

    });
  }
    
    
  
  private jwt_decode(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(base64));
      return decoded;
    } catch (error) {
      console.error("Token decoding failed:", error);
      return null;
    }
  
  }
 

  
  
 
  toggleLike(route: Route): void {
    route.liked = !route.liked;
    // Sačuvaj ažurirano stanje lajkovanja u localStorage
    const routeLikes = this.routes.map(r => ({
      id: r.id,
      liked: r.liked
    }));
    localStorage.setItem('routeLikes', JSON.stringify(routeLikes));
  }
  private loadRoutes(): void {
    this.authService.getRoutes().subscribe({
      next: (data) => {
        this.routes = data;

        // Load previously saved ratings from localStorage
        const storedRatings = localStorage.getItem('routeRatings');
        if (storedRatings) {
          const routeRatings = JSON.parse(storedRatings);
          this.routes.forEach(route => {
            const storedRoute = routeRatings.find((r: Route) => r.id === route.id);
            if (storedRoute) {
              this.selectedRating[route.id] = storedRoute.rating;
            }
          });
        }

        console.log('Routes loaded:', this.routes);
      },
      error: (err) => {
        console.error('Failed to load routes', err);
      }
    });
  }

  rateRoute(route: Route, rating: number): void {
    this.selectedRating[route.id] = rating; // Store the selected rating locally

    this.authService.rateRoute(route.id, rating).subscribe({
      next: () => {
        console.log(`Route ${route.id} rated with ${rating} stars.`);

        // Save the rating to localStorage
        const routeRatings = this.routes.map(r => ({
          id: r.id,
          rating: this.selectedRating[r.id] || 0
        }));
        localStorage.setItem('routeRatings', JSON.stringify(routeRatings));
      },
      error: (err) => {
        console.error('Failed to rate route', err);
      }
    });
  }
}