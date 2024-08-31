import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DailyStats } from '../modules/daily.stats';
import { User, UserRole } from '../modules/user.model';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';
import { Person } from '../modules/person.model';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { Activity } from '../modules/activity.model';
import { Route } from '../modules/routes.model';
import { ActivityWithRoute, Type } from'../modules/activityroute.model';
import { RouteDetailsModalComponent } from '../route-details-modal/route-details-modal.component';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Club } from '../modules/club.model';
@Component({
  selector: 'app-daily-stats',
  templateUrl: './daily-stats.component.html',
  styleUrls: ['./daily-stats.component.css']
})
export class DailyStatsComponent implements OnInit {
  totalActivitiesPerMonth: number = 0;
  totalStepsMonth: number = 0;
  totalCaloriesMonth: number = 0;
  totalDistanceMonth: number = 0;  // New field for total distance
  averagePaceMonth: number = 0;
  user: any;
  currentUser: User | undefined;
  UserRole = UserRole;
  Person!: Person;
  routes: any[] = [];
  selectedFile!: File;
  selectedFileUrl: string | null = null;
  activities: ActivityWithRoute[] = [];
  currentView: 'monthly' | 'yearly' = 'monthly';
  yearlyStats: any = {};
  monthlyStats: any ={};
  totalActivitiesPerYear: number = 0;
  totalStepsYear: number = 0;
  totalCaloriesYear: number = 0;
  totalDistanceYear: number = 0;
  clubs: Club[] = [];
  leafletMap: L.Map | null = null;
  startCoords: L.LatLng | null = null;
  endCoords: L.LatLng | null = null;
  routeLine: L.Polyline | null = null;
  route: any = {
    id: 0,
    name: '',
    startPoint: '',
    endPoint: '',
    distance: 0
  };
  distance: number = 0;
  userClubs: Set<number> = new Set(); // Track the clubs the user has joined

  constructor(private authService: AuthService, public dialog: MatDialog) {}

  ngOnInit(): void {
    const token = localStorage.getItem("jwt");
  
    if (token) {
      this.user = this.jwt_decode(token);
      if (this.user && this.user.Id) {
        this.authService.getPersonById(this.user.Id).subscribe({
          next: (result: Person) => {
            this.Person = result;
            this.authService.getUserById(this.user.Id).subscribe({
              next: (userResult: User) => {
                this.currentUser = userResult;
               
                // Check if user is admin
                if (this.currentUser && this.currentUser.role ===  UserRole.ADMINISTRATOR) {
                  this.loadRoutes();
                  setTimeout(() => {
                    this.initializeLeafletMap();
                  }, 100); // Kašnjenje od 100ms (možete promeniti trajanje po potrebi)
                } else {
                  this.loadActivities(); // Load activities for non-admin users
                  this.fetchDailyStats(); // Fetch daily stats for non-admin users
                  this.loadClubs();
                  this.loadUserClubs();
                }
              },
              error: (error) => {
                console.error('Error fetching user data:', error);
              }
            });
          },
          error: (error) => {
            console.error('Error fetching person data:', error);
          }
        });
      } else {
        console.error("Invalid user ID from token");
      }
    } else {
      console.error("Token not found in localStorage");
    }
   
  }
  ngAfterViewInit() {
    if (this.currentUser?.role === UserRole.ADMINISTRATOR) {
      this.initializeLeafletMap();
    }
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
  fetchDailyStats() {
    this.authService.getDailyStats(this.user.Id).subscribe(stats => {
      const monthlyStats = this.aggregateMonthlyStats(stats);
      this.monthlyStats = monthlyStats;  // Save monthly stats
      this.updateDashboard(monthlyStats);
  
      const yearlyStats = this.aggregateYearlyStats(stats);
      this.yearlyStats = yearlyStats;
    });
  }
  private aggregateYearlyStats(stats: DailyStats): any {
    const yearlyStats: { [key: string]: { totalSteps: number; totalCalories: number; averagePace: number; activityCount: number; totalDistance: number } } = {};

    Object.keys(stats).forEach(date => {
      const year = new Date(date).getFullYear().toString();

      if (!yearlyStats[year]) {
        yearlyStats[year] = {
          totalSteps: 0,
          totalCalories: 0,
          averagePace: 0,
          activityCount: 0,
          totalDistance: 0  // Initialize total distance
        };
      }

      yearlyStats[year].totalSteps += stats[date].TotalSteps;
      yearlyStats[year].totalCalories += stats[date].TotalCalories;
      yearlyStats[year].averagePace += stats[date].AveragePace;
      yearlyStats[year].totalDistance += stats[date].TotalDistance;  // Aggregate total distance
      yearlyStats[year].activityCount++;
    });

    // Calculate the average pace for each year
    Object.keys(yearlyStats).forEach(year => {
      if (yearlyStats[year].activityCount > 0) {
        yearlyStats[year].averagePace /= yearlyStats[year].activityCount;
      }
    });
    return yearlyStats;
  }
  
  toggleView(view: 'monthly' | 'yearly') {
    this.currentView = view;
    if (view === 'monthly') {
        this.updateDashboard(this.monthlyStats);
    } else {
        this.updateYearlyDashboard(this.yearlyStats);
    }
}

  openEditProfileDialog(data: any): void {
    const dialogRef = this.dialog.open(EditProfileModalComponent, {
      width: '250px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.updatePerson(this.user.Id, result).subscribe(
          response => {
            console.log('Profile updated successfully', response);
          },
          error => {
            console.error('Error updating profile', error);
          }
        );
      }
    });
  }
  openChangePassword(data: any): void {
    const dialogRef = this.dialog.open(ChangePasswordModalComponent, {
      width: '250px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.changePassword(this.user.Id, result).subscribe(
          response => {
            console.log('Password updated successfully', response);
          },
          error => {
            console.error('Error updating password', error);
          }
        );
      }
    });
  }

  getUserRole(userRole: number): string {
    switch (userRole) {
      case UserRole.ADMINISTRATOR:
        return 'Administrator';
      case UserRole.USER:
        return 'User';
      case UserRole.SUBSCRIBED_USER:
        return 'Subscribed User';
      default:
        return 'Unknown Role';
    }
  }
  getTypeName(type: number): string {
    switch (type) {
      case Type.RUNNING:
        return 'Running';
      case Type.CYCLING:
        return 'Cycling';
      case Type.WEIGHTLIFT:
        return 'Weightlifting';
      case Type.WALKING:
        return 'Walking';
      case Type.HIKING:
        return 'Hiking';
      case Type.PILATES:
        return 'Pilates';
      case Type.HIIT:
        return 'HIIT';
      case Type.SWIMMING:
        return 'Swimming';
      default:
        return 'Unknown Type';
    }
  }
  
  private loadActivities(): void {
    this.authService.getActivitiesByUserId(this.user.Id).subscribe(
      (data: ActivityWithRoute[]) => {
        console.log('Raw data fetched:', data);
        this.activities = Array.isArray(data) ? data : []; // Ensure it's an array
  
        if (this.activities.length > 0) {
          console.log('Parsed activities:', this.activities);
        } else {
          console.warn('No activities found or data is not in the expected format.');
        }
      },
      error => {
        console.error('Error fetching activities', error);
      }
    );
  }
  
  
  
  
  
  
  
  getDuration(startTime: string, endTime: string): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return (end.getTime() - start.getTime()) / 1000; // Duration in seconds
  }
  private aggregateMonthlyStats(stats: DailyStats): any {
    const monthlyStats: { [key: string]: { totalSteps: number; totalCalories: number; averagePace: number; activityCount: number; totalDistance: number } } = {};

    Object.keys(stats).forEach(date => {
      const month = new Date(date).toLocaleString('default', { month: 'long' });

      if (!monthlyStats[month]) {
        monthlyStats[month] = {
          totalSteps: 0,
          totalCalories: 0,
          averagePace: 0,
          activityCount: 0,
          totalDistance: 0  // Initialize total distance
        };
      }

      monthlyStats[month].totalSteps += stats[date].TotalSteps;
      monthlyStats[month].totalCalories += stats[date].TotalCalories;
      monthlyStats[month].averagePace += stats[date].AveragePace;
      monthlyStats[month].totalDistance += stats[date].TotalDistance;  // Aggregate total distance
      monthlyStats[month].activityCount++;
    });

    // Calculate the average pace for each month
    Object.keys(monthlyStats).forEach(month => {
      if (monthlyStats[month].activityCount > 0) {
        monthlyStats[month].averagePace /= monthlyStats[month].activityCount;
      }
    });

    return monthlyStats;
  }

  private updateDashboard(monthlyStats: any): void {
    const labels: string[] = Object.keys(monthlyStats);
    const stepsData: number[] = labels.map(month => monthlyStats[month].totalSteps);
    const caloriesData: number[] = labels.map(month => monthlyStats[month].totalCalories);
    const distanceData: number[] = labels.map(month => monthlyStats[month].totalDistance);
    const activitiesData: number[] = labels.map(month => monthlyStats[month].activityCount);
  
    this.totalActivitiesPerMonth = activitiesData.reduce((a, b) => a + b, 0);
    this.totalStepsMonth = stepsData.reduce((a, b) => a + b, 0);
    this.totalCaloriesMonth = caloriesData.reduce((a, b) => a + b, 0);
    this.totalDistanceMonth = distanceData.reduce((a, b) => a + b, 0);
    this.averagePaceMonth = activitiesData.length > 0 ? activitiesData.reduce((a, b) => a + b, 0) / activitiesData.length : 0;
  }
  
  private updateYearlyDashboard(yearlyStats: any): void {
    const labels: string[] = Object.keys(yearlyStats);
    const stepsData: number[] = labels.map(year => yearlyStats[year].totalSteps);
    const caloriesData: number[] = labels.map(year => yearlyStats[year].totalCalories);
    const distanceData: number[] = labels.map(year => yearlyStats[year].totalDistance);  // Get distance data
    const activitiesData: number[] = labels.map(year => yearlyStats[year].activityCount);

    this.totalActivitiesPerYear = activitiesData.reduce((a, b) => a + b, 0);
    this.totalStepsYear = stepsData.reduce((a, b) => a + b, 0);
    this.totalCaloriesYear = caloriesData.reduce((a, b) => a + b, 0);
    this.totalDistanceYear = distanceData.reduce((a, b) => a + b, 0);  // Calculate total distance
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
  getFullImageUrl(relativeUrl: string): string {
    return `http://localhost:5118${relativeUrl}`; // Adjust base URL if needed
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileUrl = window.URL.createObjectURL(file);
      this.uploadFileAndSubmit(); 
    }
  }

  uploadFileAndSubmit() {
    if (this.selectedFile) {
      this.authService.uploadFile(this.selectedFile).subscribe({
        next: (response: any) => {
          const fileUrl = response.fileUrl;
          this.Person!.profileImageUrl = fileUrl;
          this.authService.updatePerson(this.user.Id, this.Person).subscribe(
            response => {
              console.log('Profile image updated successfully', response);
            },
            error => {
              console.error('Error updating profile image', error);
            }
          );
        },
        error: (error) => {
          console.error('Error uploading file:', error);
        }
      });
    }
  }
  initializeLeafletMap() {
    const mapContainer = document.getElementById('leaflet-map');
    if (!mapContainer) {
      console.error('Leaflet map container not found');
      return;
    }

    this.leafletMap = L.map('leaflet-map').setView([45.20, 19.20], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.leafletMap);

    this.leafletMap.on('click', this.onMapClick.bind(this));
  }

  onMapClick(event: L.LeafletMouseEvent) {
    if (!this.leafletMap) {
      console.error('Map is not initialized');
      return;
    }

    const { lat, lng } = event.latlng;

    if (!this.startCoords) {
      this.startCoords = L.latLng(lat, lng);
      L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: 'https://cdn0.iconfinder.com/data/icons/running-31/64/goal-start-finish-race-finish_flag-sports_and_competition-racing-winner-512.png',
          iconSize: [32, 32]
        })
      }).addTo(this.leafletMap);
    } else if (!this.endCoords) {
      this.endCoords = L.latLng(lat, lng);
      L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/6000/6000183.png',
          iconSize: [32, 32]
        })
      }).addTo(this.leafletMap);

      if (this.startCoords && this.endCoords) {
        this.initializeRouting();
      }
    } else {
      if (this.routeLine) {
        this.leafletMap.removeLayer(this.routeLine);
      }

      this.startCoords = L.latLng(lat, lng);

      const newRouteCoords = [this.startCoords, this.endCoords];
      this.routeLine = L.polyline(newRouteCoords, { color: 'red', weight: 3 }).addTo(this.leafletMap);
    }
  }

  initializeRouting() {
    if (this.startCoords && this.endCoords && this.leafletMap) {
      const routingControl = L.Routing.control({
        waypoints: [
          this.startCoords,
          this.endCoords
        ],
        routeWhileDragging: true,
        lineOptions: {
          styles: [{ color: 'red', weight: 4 }],
          extendToWaypoints: true, // Add this property
          missingRouteTolerance: 0 // Add this property
        }
      }).addTo(this.leafletMap);
  
      routingControl.on('routesfound', (event: any) => {
        const routes = event.routes;
        routes.forEach((route: any) => {
          this.distance = route.summary.totalDistance / 1000; // Distance in km
          console.log('Route distance:', this.distance);
        });
      });
    }
  }
  
  

  createRoute() {
    if (this.startCoords && this.endCoords) {
      this.route.startPoint = this.startCoords.toString();
      this.route.endPoint = this.endCoords.toString();
      this.route.distance = this.distance;

      this.authService.createRoute(this.route).subscribe((response: any) => {
        console.log('Route created:', response);
      });
    } else {
      console.error('Start point or end point is missing.');
    }
  }

  openRouteDetailsModal() {
    const dialogRef = this.dialog.open(RouteDetailsModalComponent, {
      data: { name: this.route.name, distance: this.distance, weight: 0 },
      width: '300px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      this.route.id =result.id;
        this.route.name = result.name;
        this.route.distance = result.distance;
        this.route.weight = result.weight;
        this.createRoute();
      }
    });
  }

  deleteRoute(id: number): void {
    this.authService.deleteRoute(id).subscribe(
      () => {
        console.log('Route deleted successfully');
        // Update the routes array to remove the deleted route
        this.routes = this.routes.filter(route => route.id !== id);
      },
      error => {
        console.error('Error deleting route:', error);
      }
    );
  }
  private loadClubs(): void {

    
      this.authService.getClubs().subscribe({
        next: (data) => {
          this.clubs = data;
        },
        error: (err) => {
          console.error('Failed to load clubs', err);
        }
      });
    
  }
  loadUserClubs() {
    this.authService.getUserClubs(this.user.Id).subscribe(clubs => {
      this.userClubs = new Set(clubs.map(club => club.id));
      this.updateClubStatus();
    });
  }

  updateClubStatus() {
    this.clubs.forEach(club => {
      console.log(`Club ID: ${club.id}, Joined: ${this.userClubs.has(club.id)}`);
      club.isJoined = this.userClubs.has(club.id);
    });
  }
  

  onClubClick(club: number) {
    if (this.currentUser?.role === UserRole.SUBSCRIBED_USER) {
      this.joinClub(club);
    } else {
      console.log('User is not subscribed.');
    }
  }

  joinClub(clubid: number) {
    this.authService.joinClub(this.user.Id, clubid).subscribe({
      next: (response) => {
        console.log('Successfully joined the club', response);
        this.userClubs.add(clubid);
        this.updateClubStatus();
      },
      error: (err) => {
        console.error('Failed to join the club', err);
        // Handle error
      }
    });
  }

}