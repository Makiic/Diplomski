import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.css']
})
export class RouteMapComponent implements AfterViewInit, OnDestroy {
  @Input() route: any; // Route data should include startPoint and endPoint
  @Input() id: string = 'map-container'; // Default ID
  private map: L.Map | undefined;
  private routeControl: L.Routing.Control | undefined;

  ngAfterViewInit(): void {
    if (this.route) {
      this.initializeMap();
    }
  }

  ngOnDestroy(): void {
    // Clean up map instance if it exists
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  private initializeMap(): void {
    // Remove previous map instance if it exists
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }

    const mapContainer = document.getElementById(this.id) as HTMLElement;
    if (!mapContainer) {
      console.error('Map container element not found');
      return;
    }

    // Initialize map
    this.map = L.map(mapContainer).setView(
      [this.getLatLng(this.route.startPoint)[0], this.getLatLng(this.route.startPoint)[1]],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.initializeRouting();
  }

  private initializeRouting(): void {
    if (this.route.startPoint && this.route.endPoint && this.map) {
      const startLatLng = this.getLatLng(this.route.startPoint);
      const endLatLng = this.getLatLng(this.route.endPoint);

      // Remove previous routing control if it exists
      if (this.routeControl) {
        this.map.removeControl(this.routeControl);
        this.routeControl = undefined;
      }

      this.routeControl = L.Routing.control({
        waypoints: [
          L.latLng(startLatLng),
          L.latLng(endLatLng)
        ],
        routeWhileDragging: true,
        lineOptions: {
          styles: [{ color: 'green', weight: 5 }],
          extendToWaypoints: true,
          missingRouteTolerance: 2
        },
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1'
        })
      }).addTo(this.map);

      // Hide the routing control container
      const controlContainer = this.routeControl.getContainer();
      if (controlContainer) {
        controlContainer.style.display = 'none';
      }

      // Fit map bounds to the route
      const bounds = L.latLngBounds([
        L.latLng(startLatLng),
        L.latLng(endLatLng)
      ]);

      if (this.map) {
        this.map.fitBounds(bounds);
      }
    } else {
      console.error('Route coordinates or map are missing');
    }
  }

  private getLatLng(latlngStr: string): [number, number] {
    const match = latlngStr.match(/LatLng\(([^,]+),\s*([^)]+)\)/);
    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2])];
    }
    console.error('Invalid LatLng string format:', latlngStr);
    return [0, 0]; // Default value
  }
  
}
