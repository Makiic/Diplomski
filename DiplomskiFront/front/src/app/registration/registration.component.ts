import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Person } from '../modules/person.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  repeatedPassword: string = 'none';
  selectedFile!: File;
  selectedFileUrl: string | null = null;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void { }

  registrationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    rpassword: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    surname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    city: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    country: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    number: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(10)]),
    picture: new FormControl(null)
  });

  registerSubmited() {
    if (this.Password.value === this.RPassword.value) {
      this.repeatedPassword = 'none';

      if (this.selectedFile) {
        this.uploadFileAndSubmit();
      } else {
        this.submitRegistrationForm();
      }
    } else {
      this.repeatedPassword = 'inline';
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileUrl = window.URL.createObjectURL(file);
    }
  }

  uploadFileAndSubmit() {
    this.authService.uploadFile(this.selectedFile).subscribe({
      next: (response: any) => {
        const fileUrl = response.fileUrl;
        this.submitRegistrationForm(fileUrl);
      },
      error: (error) => {
        this.errorMessage = 'File upload failed. Please try again.';
        console.error('Error uploading file:', error);
      }
    });
  }

  submitRegistrationForm(fileUrl?: string) {
    const personData: Person = {
      email: this.Email.value || '',
      password: this.Password.value || '',
      name: this.Name.value || '',
      surname: this.Surname.value || '',
      city: this.City.value || '',
      country: this.Country.value || '',
      phone: this.Number.value || '',
      profileImageUrl: fileUrl || ''
    };

    this.authService.createPerson(personData).subscribe(
      (response: any) => {
        this.successMessage = response?.message || 'Registration successful. Please check your email.';
        this.errorMessage = '';
      },
      error => {
        this.successMessage = '';
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }

  get Email(): FormControl {
    return this.registrationForm.get('email') as FormControl;
  }

  get Password(): FormControl {
    return this.registrationForm.get('password') as FormControl;
  }

  get RPassword(): FormControl {
    return this.registrationForm.get('rpassword') as FormControl;
  }

  get Name(): FormControl {
    return this.registrationForm.get('name') as FormControl;
  }

  get Surname(): FormControl {
    return this.registrationForm.get('surname') as FormControl;
  }

  get City(): FormControl {
    return this.registrationForm.get('city') as FormControl;
  }

  get Country(): FormControl {
    return this.registrationForm.get('country') as FormControl;
  }

  get Number(): FormControl {
    return this.registrationForm.get('number') as FormControl;
  }

  get Picture(): FormControl {
    return this.registrationForm.get('picture') as FormControl;
  }
}
