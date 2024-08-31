import { Component } from '@angular/core';
import { Person } from '../modules/person.model';
import { AuthService } from '../services/auth.service';
import { User, UserRole } from '../modules/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: 'user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  user: any;
  currentUser: User | undefined;
  UserRole = UserRole;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("jwt");
  
    if (token) {
      this.user = this.jwt_decode(token);
      if (this.user && this.user.Id) {
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
      } else {
        console.error("Invalid user ID from token");
      }
    } else {
      console.error("Token not found in localStorage");
    }
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
  
}
