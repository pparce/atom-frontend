import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionService } from '@services/connection.service';
import { MessageService } from '@services/message.service';
import { ApiRoutes } from 'src/app/api.routes';
import { Task } from 'src/app/models/task.interface';
import { User } from 'src/app/models/user.interface';

@Component({
    selector: 'app-task-form-modal',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './task-form-modal.component.html',
    styleUrl: './task-form-modal.component.scss',
})
export class TaskFormModalComponent {
    user!: User;
    task?: Task;
    form = new FormGroup({
        title: new FormControl<string>('', Validators.required),
        description: new FormControl<string>(''),
        completed: new FormControl<boolean>(false),
    });

    activeModal = inject(NgbActiveModal);
    connectionService = inject(ConnectionService);
    messageService = inject(MessageService);

    ngOnInit() {
        if (this.task?.id) {
            this.initForm();
        }
    }


    initForm() {
        this.form.controls['title'].setValue(this.task?.title || '');
        this.form.controls['description'].setValue(this.task?.description || '');
        this.form.controls['completed'].setValue(this.task?.completed || false);
    }

    onCancel() {
        this.activeModal.dismiss();
    }


    onSave() {
        if (this.task?.id) {
            this.editTask();
        } else {
            this.addTask();
        }
    }

    addTask() {
        this.messageService.loading('Agregando tarea...');
        this.connectionService.post({ url: ApiRoutes.TASK, data: this.buildJSON() }).subscribe({
            next: (response) => {
                this.messageService.removeAll();
                this.activeModal.close(response);
            },
            error: (error) => {
                this.messageService.removeAll();
                this.messageService.error(error.message || 'Error al agregar la tarea');
            }
        });
    }

    editTask() {
        this.messageService.loading('Actualizando tarea...');
        this.connectionService.put({ url: ConnectionService.buildUrlWithId(ApiRoutes.TASK, this.task?.id), data: this.buildJSON() }).subscribe({
            next: (response) => {
                this.messageService.removeAll();
                this.activeModal.close(response);
            },
            error: (error) => {
                this.messageService.removeAll();
                this.messageService.error(error.message || 'Error al actualizar la tarea');
            }
        });
    }

    buildJSON() {
        return {
            ...(this.task ? { id: this.task.id } : {}),
            title: this.form.controls['title'].value,
            description: this.form.controls['description'].value,
            completed: this.form.controls['completed'].value,
            userId: this.user.id,
        };
    }
}
