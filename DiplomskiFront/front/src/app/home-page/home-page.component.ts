import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  routes: any[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadRoutes();
  }

  private loadRoutes(): void {
    this.authService.getRoutes().subscribe({
      next: (data) => {
        this.routes = data;
        console.log('Routes loaded:', this.routes);
      },
      error: (err) => {
        console.error('Failed to load routes', err);
      }
    });
  }
}
