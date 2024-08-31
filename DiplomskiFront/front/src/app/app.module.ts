import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthService } from './services/auth.service';
import { HomePageComponent } from './home-page/home-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LogInComponent } from './log-in/log-in.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DatePipe } from '@angular/common'; 
import { GoogleMapsModule } from '@angular/google-maps';
import { CreateRouteComponent } from './create-route/create-route.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouteDetailsModalComponent } from './route-details-modal/route-details-modal.component';
import { RouteMapComponent } from './route-map/route-map.component'; // Ensure this import
import { DailyStatsComponent } from './daily-stats/daily-stats.component';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';
import { Chart } from 'chart.js';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RoutesModalComponent } from './routes-modal/routes-modal.component';
@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    HomePageComponent,
    NavbarComponent,
    LogInComponent,
    CreateRouteComponent,
    RouteDetailsModalComponent,
    RouteMapComponent,
    DailyStatsComponent,
    EditProfileModalComponent,
    RoutesModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule, 
    HttpClientModule,
    GoogleMapsModule,
    FormsModule, 
    LeafletModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgbModule, 
  ],
 
  providers: [
    AuthService,
    DatePipe,
    provideAnimationsAsync(),
   
  ],
  bootstrap: [AppComponent],
  exports: [RouteMapComponent]
 
})
export class AppModule { }
