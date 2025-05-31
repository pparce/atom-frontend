import { Component, computed, ElementRef, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EmptyScreenComponent } from '@components/empty-screen/empty-screen.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { StopPropagationDirective } from '@directives/stop-propagation.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth.service';
import { ConnectionService } from '@services/connection.service';
import { MessageService } from '@services/message.service';
import { ApiRoutes } from 'src/app/api.routes';
import { Task } from 'src/app/models/task.interface';
import { User } from 'src/app/models/user.interface';
import { ServerData } from 'src/app/models/utils.interface';
import { TaskFormModalComponent } from 'src/app/pages/task/task-form-modal/task-form-modal.component';

@Component({
    selector: 'app-task',
    imports: [
        RouterModule,
        LoadingComponent,
        EmptyScreenComponent,
        StopPropagationDirective
    ],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
    tasks = signal<ServerData<Task[]>>({
        data: [],
        status: 'loading',
    });
    user = signal<User>({});
    taskUncompleted = computed(() => {
        return this.tasks().data?.filter(task => !task.completed);
    });
    taskCompleted = computed(() => {
        return this.tasks().data?.filter(task => task.completed);
    });
    selectedTask = signal<Task | null>(null);
    logoutConfirmModal = viewChild<ElementRef<HTMLDialogElement>>('logoutConfirmModal');
    deleteConfirmModal = viewChild<ElementRef<HTMLDialogElement>>('deleteConfirmModal');

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
        let modalRef = this.modalService.open(TaskFormModalComponent, { size: 'md' });
        modalRef.componentInstance.user = this.user();
        modalRef.componentInstance.task = {} as Task;
        modalRef.result.then(
            (result) => {
                if (result) {
                    this.tasks.update(tasks => {
                        return {
                            data: [result, ...(tasks.data || [])],
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
        let modalRef = this.modalService.open(TaskFormModalComponent, { size: 'md' });
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

    onCheckTask(task: Task) {
        this.messageService.loading('Actualizando tarea...');
        this.connectionService.put({ url: ConnectionService.buildUrlWithId(ApiRoutes.TASK, task.id), data: { completed: !task.completed } }).subscribe({
            next: () => {
                this.messageService.removeAll();
                this.tasks.update(tasks => {
                    return {
                        data: tasks.data?.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t),
                        status: 'success',
                    };
                });
                this.messageService.success('Tarea actualizada correctamente');
            },
            error: (error) => {
                this.messageService.removeAll();
                this.messageService.error(error.message || 'Error al actualizar la tarea');
            },
        });
    }

    onDeleteTask() {
        this.messageService.loading('Eliminando tarea...');
        this.connectionService.delete(ConnectionService.buildUrlWithId(ApiRoutes.TASK, this.selectedTask()?.id)).subscribe({
            next: () => {
                this.tasks.update(tasks => {
                    return {
                        data: tasks.data?.filter(t => t.id !== this.selectedTask()?.id),
                        status: 'success',
                    };
                });
                this.messageService.removeAll();
                this.messageService.success('Tarea eliminada correctamente');
                this.selectedTask.set(null);
            },
            error: (error) => {
                this.messageService.error(error.message || 'Error al eliminar la tarea');
                this.messageService.removeAll();
                this.messageService.error('Error al eliminar la tarea');
            },
        });
    }
    

    onLogout(content: TemplateRef<any>) {
        
       
    }

    logout() {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }
}
