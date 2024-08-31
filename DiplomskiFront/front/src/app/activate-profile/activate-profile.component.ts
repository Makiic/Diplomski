import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-activate-profile',
    templateUrl: './activate-profile.component.html',
    styleUrls: ['./activate-profile.component.css']
})
export class ActivateProfileComponent implements OnInit {
    activationLink: string | undefined;
    message: string | undefined;

    constructor(
        private route: ActivatedRoute,
        private activationService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const link = params.get('link');
            if (link) {
                this.activationLink = link;
                this.activateUser(this.activationLink);
            } else {
                this.message = 'Invalid activation link.';
            }
        });
    }

    activateUser(link: string): void {
        this.activationService.activateProfile(link).subscribe(
            () => {
                this.message = 'Your account has been activated successfully!';
                setTimeout(() => this.router.navigate(['']), 2000); // Redirect after a delay
            },
          (            error: { error: { message: any; }; }) => {
                this.message = 'Activation failed: ' + (error.error?.message || 'An error occurred.');
            }
        );
    }
}
