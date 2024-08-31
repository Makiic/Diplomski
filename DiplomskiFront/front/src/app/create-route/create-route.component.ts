import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { AuthService } from '../services/auth.service';
import { RouteDetailsModalComponent } from '../route-details-modal/route-details-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.css']
})
export class CreateRouteComponent implements OnInit {
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

  constructor(private authService: AuthService, public dialog: MatDialog) {}

  ngOnInit() {
    this.initializeLeafletMap();
  }

  initializeLeafletMap() {
    const mapContainer = document.getElementById('leaflet-map');
    if (!mapContainer) {
      console.error('Leaflet map container not found');
      return;
    }

    this.leafletMap = L.map('leaflet-map').setView([0, 0], 2);
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
}
