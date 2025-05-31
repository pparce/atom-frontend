import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-login-confirm-modal',
    imports: [],
    templateUrl: './login-confirm-modal.component.html',
    styleUrl: './login-confirm-modal.component.scss',
})
export class LoginConfirmModalComponent {
    email: string = '';

    activeModal = inject(NgbActiveModal);

    onConfirm(){
        this.activeModal.close(true);
    }

    onCancel(){
        this.activeModal.dismiss();
    }
}
