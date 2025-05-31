import { Injectable, TemplateRef } from '@angular/core';

export interface ToastInfo {
    header: string;
    body: string;
    delay?: number;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
    toasts: any[] = [];

    loading(message: string = 'Cargando datos...') {
        this.toasts.push({ message: message, classname: 'bg-secondary text-light', delay: 5000, icon: "fa-spinner fa-pulse" });
    }

    success(message: string) {
        this.toasts.push({ message: message, classname: 'bg-success text-light', delay: 5000, icon: "fa-check" });
    }

    error(message: string) {
        this.toasts.push({ message: message, classname: 'bg-danger text-light', delay: 5000, icon: "fa-exclamation-triangle" });
    }

    remove(toast: ToastInfo) {
        this.toasts = this.toasts.filter(t => t != toast);
    }

    removeAll(){
        this.toasts = [];
    }
}