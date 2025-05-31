import { Component, input } from '@angular/core';

@Component({
    selector: 'app-empty-screen',
    imports: [],
    templateUrl: './empty-screen.component.html',
    styleUrl: './empty-screen.component.scss',
})
export class EmptyScreenComponent {
    title = input<string>('No Data');
    description = input<string>('No hay datos disponibles en este momento. Por favor, inténtalo de nuevo más tarde.');
    icon = input<string>('fa fa-exclamation-triangle');
}
