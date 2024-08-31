import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from '../modules/person.model';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { JwtHelperService} from '@auth0/angular-jwt';
import { formatDate } from '@angular/common';

import { Login } from '../modules/login.model';
import { User } from '../modules/user.model';
import { Route } from '../modules/routes.model';
import { HttpEvent } from '@angular/common/http';
import { ActivityWithRoute } from '../modules/activityroute.model';
import { ChangePasswordDto } from '../modules/change-password.model';
import { Club } from '../modules/club.model';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

 


  constructor(private http: HttpClient) { }

  currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  baseServerUrl = "http://localhost:5118/api/";

  jwtHelperService = new JwtHelperService();
  createPerson(person: Person): Observable<any> {
    return this.http.post(`${this.baseServerUrl}Person`, person, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  
    login(login:Login) :  Observable<any>{
    return this.http.post<any>("http://localhost:5118/api/Auth/login", login);
  }
  getAdminById(idp: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseServerUrl}Person/GetAdminById/`+idp);
  }
  updateAdmin(updatedPerson: Person) {
    return this.http.patch<Person>(`${this.baseServerUrl}Person/UpdateAdmin`, updatedPerson);
  }

  getRegisteredUserById(idp: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseServerUrl}Person/GetRegisteredUserById/`+idp);
  }
  updateRegisteredUser(updatedPerson: Person) {
    return this.http.patch<Person>(`${this.baseServerUrl}Person/UpdateRegisteredUser/`, updatedPerson);
  }

  getUserById(idp: number): Observable<User> {
    return this.http.get<User>(`${this.baseServerUrl}User/GetUserById/${idp}`);
  }

  getPersonById(idp: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseServerUrl}Person/GetPersonById/${idp}`);
  }
  loginUser(loginInfo: Array<string>)
  {
    return this.http.post(this.baseServerUrl + 'User/LoginUser', {
      Email: loginInfo[0],
      Password: loginInfo[1]
    }, {
      responseType: 'text',
    });

    
  }

  
  logout(): void {
    // Brisanje tokena iz lokalnog skladišta
    localStorage.removeItem('jwt');
    // Postavljanje trenutnog korisnika na null
    this.currentUser.next(null);
  }
  getUserProfile(): Observable<Person> {
    return this.http.get<Person>(`${this.baseServerUrl}Person/UserProfile`);
  }
  
 
  createRoute(routeData: any): Observable<any> {
    return this.http.post<any>(`${this.baseServerUrl}Routes`, routeData);
  }
  getRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(`${this.baseServerUrl}Routes`);
  }

  getDailyStats(userId: number): Observable<any> {
    const params = {
      userId: userId.toString(),
    
    };
    return this.http.get<any>(`${this.baseServerUrl}Activities/daily-stats`, { params });
  }
  updatePerson(id: number|undefined, updatedPerson: Person): Observable<Person> {
    return this.http.put<Person>(`${this.baseServerUrl}Person/UpdatePerson/${id}`, updatedPerson)
      .pipe(
        catchError(error => {
          console.error('Error updating person:', error);
          return throwError(error);
        })
      );
  }

  activateProfile(link: string): Observable<void> {
    return this.http.put<void>(`${this.baseServerUrl}Person/ActivateProfile/${link}`, {});
}

uploadFile(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post(`${this.baseServerUrl}Person/upload`, formData);
}
createPersonWithFile(formData: FormData): Observable<any> {
  return this.http.post<any>(`${this.baseServerUrl}Person`, formData);
}
changePhoto(id: number, updatedPerson: Person): Observable<Person> {
  return this.http.put<Person>(`${this.baseServerUrl}Person/${id}`, updatedPerson)
    .pipe(
      catchError(error => {
        console.error('Error updating person:', error);
        return throwError(error);
      })
    );
}

changePassword(id: number, changePasswordDto: ChangePasswordDto): Observable<any> {
  return this.http.put<any>(`${this.baseServerUrl}Person/ChangePassword/${id}`, changePasswordDto)
    .pipe(
      catchError(error => {
        console.error('Error updating password:', error);
        return throwError(error);
      })
    );
}
// Update the service method to reflect the correct response type
getActivitiesByUserId(userId: number): Observable<ActivityWithRoute[]> {
  return this.http.get<ActivityWithRoute[]>(`${this.baseServerUrl}Activities/activities/${userId}`);
}
deleteRoute(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseServerUrl}Routes/${id}`);
}
rateRoute(routeId: number, rating: number): Observable<any> {
  return this.http.post(`${this.baseServerUrl}Routes/${routeId}/rate`, rating);
}
getClubs(): Observable<Club[]> {
  return this.http.get<Club[]>(`${this.baseServerUrl}Clubs`);
}


joinClub(userId: number, clubId: number): Observable<any> {
  return this.http.post<any>(`http://localhost:5118/api/User/${userId}/join-club/${clubId}`, {}, {
    responseType: 'json'
  });
}
getUserClubs(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:5118/api/User/${userId}`);
}
}

