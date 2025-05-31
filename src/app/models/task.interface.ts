import { User } from "src/app/models/user.interface";

export interface Task {
    id?: string;
    title: string;
    description: string;
    createdAt: string;
    completed: boolean;
    user: User;
}