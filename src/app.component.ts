import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule],
    providers: [MessageService],
    template: ` <p-toast />
        <router-outlet></router-outlet>`,
})
export class AppComponent {
    constructor(private router: Router,private messageService: MessageService,private primeng: PrimeNG) {}
}
