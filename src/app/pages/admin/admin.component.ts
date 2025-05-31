import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth.service';
import { ConnectionService } from '@services/connection.service';
import { MessageService } from '@services/message.service';

@Component({
    selector: 'app-admin',
    imports: [
        RouterModule
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.css',
})
export class AdminComponent {
    modalConfirm = viewChild('modalConfirm');

    connectionService = inject(ConnectionService);
    messageService = inject(MessageService);
    authService = inject(AuthService);
    router = inject(Router);
    modalService = inject(NgbModal);


    onLogout(content: TemplateRef<any>) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            (result) => {
            },
            (reason) => {
            },
        );
    }

    logout() {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }
}
