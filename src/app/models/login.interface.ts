import { User } from "src/app/models/user.interface";

export interface Login {
    token: string;
    user: User;
}