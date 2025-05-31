import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
    selector: 'app-loading',
    imports: [],
    templateUrl: './loading.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent { 
    error = input<boolean>(false);
    onRetry = output<void>();

    
}
