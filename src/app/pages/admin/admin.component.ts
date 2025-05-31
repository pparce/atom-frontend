import { Component, inject, signal, TemplateRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth.service';
import { ConnectionService } from '@services/connection.service';
import { MessageService } from '@services/message.service';
import { ApiRoutes } from 'src/app/api.routes';
import { Task } from 'src/app/models/task.interface';
import { User } from 'src/app/models/user.interface';
import { ServerData } from 'src/app/models/utils.interface';
import { TaskFormModalComponent } from 'src/app/pages/admin/task-form-modal/task-form-modal.component';
import { EmptyScreenComponent } from "../../components/empty-screen/empty-screen.component";
import { LoadingComponent } from "../../components/loading/loading.component";

@Component({
    selector: 'app-admin',
    imports: [
        RouterModule,
        LoadingComponent,
        EmptyScreenComponent
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
})
export class AdminComponent {
    tasks = signal<ServerData<Task[]>>({
        data: [],
        status: 'loading',
    });
    user = signal<User>({});

    connectionService = inject(ConnectionService);
    messageService = inject(MessageService);
    authService = inject(AuthService);
    router = inject(Router);
    modalService = inject(NgbModal);

    ngOnInit() {
        this.user.set(this.authService.getUser() || {});
        if (this.user().id) {
            this.getTasks();

        }
    }

    getTasks() {

        this.connectionService.get({ url: ConnectionService.buildUrlWithId(ApiRoutes.TASK, this.user().id) }).subscribe({
            next: (response) => {
                this.tasks.set({
                    data: response || [],
                    status: 'success',
                });
            },
            error: (error) => {
                this.tasks.set({
                    data: [],
                    status: 'error',
                    message: error.message || 'Failed to load tasks',
                });
                this.messageService.error(error.message || 'Failed to load tasks');
            },
        });
    }

    onAddTask() {
        let modalRef = this.modalService.open(TaskFormModalComponent, { size: 'lg' });
        modalRef.componentInstance.user = this.user();
        modalRef.componentInstance.task = {} as Task;
        modalRef.result.then(
            (result) => {
                if (result) {
                    this.tasks.update(tasks => {
                        return {
                            data: [...(tasks.data || []), result],
                            status: 'success',
                        };
                    });
                }
            }
        ).catch((error) => {
            if (error) {
            }
        }
        );
    }

    onEditTask(task: Task) {
        let modalRef = this.modalService.open(TaskFormModalComponent, { size: 'lg' });
        modalRef.componentInstance.user = this.user();
        modalRef.componentInstance.task = task;
        modalRef.result.then(
            (result) => {
                this.tasks.update(tasks => {
                    return {
                        data: tasks.data?.map(t => t.id === result.id ? result : t),
                        status: 'success',
                    };
                });
            }
        ).catch((error) => {
            if (error) {
            }
        });
    }

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
