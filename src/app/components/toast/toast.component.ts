import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '@services/message.service';

@Component({
    selector: 'app-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    imports: [
        CommonModule,
        NgbToastModule
    ],
})
export class ToastComponent implements OnInit {

    messageService = inject(MessageService);

    ngOnInit(): void {

    }

    onChange() {
        console.log(this.messageService.toasts);
    }

}
