import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login.interface';
import { User } from 'src/app/models/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private user: User | null = null;
    private login: Login | null = null;

    private app_session_name = 'atom_session';

    private router = inject(Router);

    constructor() {
        this.init();
    }

    init() {
        const session = localStorage.getItem(this.app_session_name);
        if (session) {
            this.login = JSON.parse(session);
            this.user = this.login && this.login.user ? this.login.user : null;
        }
    }

    public setUser(user: User) {

    }

    public setLogin(login: Login) {
        this.login = login;
        this.user = login.user;
        this.saveData();
    }

    public getUser(): User | null {
        return this.user;
    }

    public getLogin(): Login | null {
        return this.login;
    }

    public logout() {
        this.login = null;
        this.user = null;
        this.saveData();
        this.router.navigate(['/login']);
    }

    public isAuthenticated(): boolean {
        return this.login !== null && this.login.token !== '';
    }

    private saveData() {
        if (this.login) {
            localStorage.setItem(this.app_session_name, JSON.stringify(this.login));
        } else {
            localStorage.removeItem(this.app_session_name);
        }
    }
}
