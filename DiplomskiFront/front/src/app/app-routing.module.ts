import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { RegistrationComponent } from './registration/registration.component';
import { LogInComponent } from './log-in/log-in.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CreateRouteComponent } from './create-route/create-route.component';
import { RouteDetailsModalComponent } from './route-details-modal/route-details-modal.component';
import { RouteMapComponent } from './route-map/route-map.component'; // Ensure this import
import { DailyStatsComponent } from './daily-stats/daily-stats.component';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';
import { ActivateProfileComponent } from './activate-profile/activate-profile.component';
const routes: Routes = [
  { path: 'app-homepage', component: HomePageComponent }, 
  { path: 'app-registration', component: RegistrationComponent }, 
  { path: '', component:LogInComponent},
  { path: 'app-navbar', component:NavbarComponent},
  { path: 'app-user-profile', component:UserProfileComponent},
  { path: 'app-create-route', component:CreateRouteComponent},
  { path: 'app-route-details', component:RouteDetailsModalComponent},
  { path: 'app-route-map', component:RouteMapComponent},
  { path: 'app-daily-stats', component:DailyStatsComponent},
  { path: 'app-edit-profile-modal', component:EditProfileModalComponent},
  { path: 'ActivateProfile/:link', component: ActivateProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
