import { Component } from '@angular/core';
import { User,UserRole } from '../modules/user.model';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RoutesModalComponent } from '../routes-modal/routes-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
 
  user: any;
  currentUser: User | undefined;
  UserRole = UserRole;
  // Declare the variable at the top of your component
showOptions: boolean = false;


  constructor(private authService: AuthService, private router: Router,public dialog: MatDialog, ) { }

  ngOnInit(): void {
   
 
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
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  }
  openRoutesModal(): void {
    const dialogRef = this.dialog.open(RoutesModalComponent, {
      width: '80vw',  // Širina modala (80% širine prikaza)
      height: '80vh', // Visina modala (80% visine prikaza)
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container' // Prilagođena klasa za stilizovanje
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal closed');
    });
  }
}