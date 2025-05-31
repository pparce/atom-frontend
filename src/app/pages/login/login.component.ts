import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth.service';
import { ConnectionService } from '@services/connection.service';
import { ApiRoutes } from 'src/app/api.routes';
import { LoginConfirmModalComponent } from 'src/app/pages/login/login-confirm-modal/login-confirm-modal.component';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    email = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);

    connectionService = inject(ConnectionService);
    modalService = inject(NgbModal);
    router = inject(Router);
    authService = inject(AuthService);

    onLogin() {
        this.connectionService.post({ url: ApiRoutes.AUTH_LOGIN, data: this.buildJSON() }).subscribe({
            next: (response) => {
                this.authService.setLogin(response);
                this.router.navigateByUrl('/admin');
            },
            error: (error) => {
                console.error('Login failed', error);
            }
        });
    }

    onConfirmEmail() {
        let modalRef = this.modalService.open(LoginConfirmModalComponent)
        modalRef.componentInstance.email = this.email.value;
        modalRef.result.then((result) => {
            if (result) {
                this.createUser();
            }
        }
        ).catch((error) => {
            console.error('Modal dismissed', error);
        }
        );
    }

    createUser() {

    }

    buildJSON() {
        return {
            email: this.email.value
        }
    }
}
