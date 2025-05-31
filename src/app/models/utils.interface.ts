
export interface ServerData<T> {
    data?: T;
    message?: string;
    status?: 'success' | 'error' | 'loading';
}
