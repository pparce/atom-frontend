import { inject, Injectable } from '@angular/core';
// import { merge } from 'lodash';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login.interface';
import { User } from 'src/app/models/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private user: User | null = null;

    private app_session_name = 'atom_session';

    private router = inject(Router);

    constructor() {
        this.init();
    }

    init() {
        
    }

    public setUser(user: User) {
        
    }

    public setLogin(login: Login) {
       
    }

    public getUser(): User | null {
        return this.user;
    }


    public logout() {
        
    }

    public isAuthenticated(): boolean {
        return this.user != null;
    }

}
