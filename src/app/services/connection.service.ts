import { Location } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Get {
    url?: string;
    params?: Object;
    urlPagination?: string;
}

export interface Post {
    url: string;
    data: any;

}

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {

    constructor(
        private http: HttpClient,
        private _location: Location,
    ) {
    }

    public get(data: Get): Observable<any> {
        let urlAux: string = data.urlPagination ?? environment.apiServer + data.url;
        let httpParams: HttpParams = new HttpParams();
        if (data.params != null) {
            for (let index = 0; index < Object.keys(data.params).length; index++) {
                const element = Object.keys(data.params)[index];
                httpParams = httpParams.append(element, Object.values(data.params!)[index]);
            }
        }
        return this.http.get(urlAux, {
            params: httpParams,
        });
    }

    public post(data: Post): Observable<any> {
        let urlAux: string = environment.apiServer + data.url;
        return this.http.post(urlAux, data.data);
    }

    public put(data: Post): Observable<any> {
        let urlAux: string = environment.apiServer + data.url;
        return this.http.put(urlAux, data.data);
    }

    public delete(url: string): Observable<any> {
        let urlAux: string = environment.apiServer + url;
        return this.http.delete(urlAux);
    }

    public back(): void {
        this._location.back();
    }

    public static buildUrlWithId(url: string, id: any) {
        if (url.indexOf(':id') != -1) {
            return url.replace(':id', `${id}`);
        }
        return `${url}${id}/`;
    }

    public static addParamsToUrl(url: string, params: Object) {
        let urlAux: string = url;
        if (params != null) {
            for (let index = 0; index < Object.keys(params).length; index++) {
                const element = Object.keys(params)[index];
                urlAux = urlAux.replace(`:${element}`, Object.values(params)[index]);
            }
        }
        return urlAux;
    }

    public static convertToFormData(obj: any, form: any = null, namespace: any = null): FormData {
        const formData = form || new FormData();

        for (const property in obj) {
            if (obj.hasOwnProperty(property)) {
                const formKey = namespace ? `${namespace}[${property}]` : property;

                if (obj[property] instanceof File) {
                    formData.append('image', obj[property], obj[property].name);
                } else if (Array.isArray(obj[property]) && obj[property].every((item: any) => typeof item !== 'object')) {
                    // Handle simple arrays directly
                    formData.append(formKey, obj[property].join(','));
                } else if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
                    ConnectionService.convertToFormData(obj[property], formData, formKey);
                } else {
                    formData.append(formKey, obj[property]);
                }
            }
        }
        return formData;
    }
}
