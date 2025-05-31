import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
        title: 'Login',
    },
    {
        path: 'task',
        loadComponent: () => import('./pages/task/task-list/task-list.component').then(m => m.TaskListComponent),
        canActivate: [AuthGuard],
        title: 'Listado de Tareas',
    }
];
