import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISchema, Schema, SchemaEntity } from '@guardian/interfaces';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api';
import { AuthService } from './auth.service';

/**
 * Services for working from Schemas.
 */
@Injectable()
export class SchemaService {
    private readonly url: string = `${API_BASE_URL}/schemas`;

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {
    }

    public create(schema: Schema, topicId: any): Observable<ISchema[]> {
        return this.http.post<any[]>(`${this.url}/${topicId}`, schema);
    }

    public pushCreate(schema: Schema, topicId: any): Observable<{ taskId: string, expectation: number }> {
        return this.http.post<{ taskId: string, expectation: number }>(`${this.url}/push/${topicId}`, schema);
    }

    public update(schema: Schema, id?: string): Observable<ISchema[]> {
        const data = Object.assign({}, schema, { id: id || schema.id });
        return this.http.put<any[]>(`${this.url}`, data);
    }

    public newVersion(schema: Schema, id?: string): Observable<{ taskId: string, expectation: number }> {
        const data = Object.assign({}, schema, { id: id || schema.id });
        return this.http.post<{ taskId: string, expectation: number }>(`${this.url}/push/${data.topicId}`, data);
    }

    public getSchemas(topicId?: string): Observable<ISchema[]> {
        if (topicId) {
            return this.http.get<ISchema[]>(`${this.url}/${topicId}`);
        }
        return this.http.get<ISchema[]>(`${this.url}`);
    }

    public list(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/list/all`);
    }

    public getSchemasByPolicy(policyId: string): Observable<ISchema[]> {
        return this.http.get<ISchema[]>(`${this.url}?policyId=${policyId}`);
    }

    public getSchemasByPage(topicId?: string, pageIndex?: number, pageSize?: number): Observable<HttpResponse<ISchema[]>> {
        let url = `${this.url}`;
        if (topicId) {
            url += `/${topicId}`
        }
        if (Number.isInteger(pageIndex) && Number.isInteger(pageSize)) {
            url += `?pageIndex=${pageIndex}&pageSize=${pageSize}`;
        }
        return this.http.get<any>(url, { observe: 'response' });
    }

    public getSchemasByType(type: string): Observable<ISchema> {
        return this.http.get<ISchema>(`${this.url}/type/${type}`);
    }

    public publish(id: string, version: string): Observable<ISchema[]> {
        return this.http.put<any[]>(`${this.url}/${id}/publish`, { version });
    }

    public pushPublish(id: string, version: string): Observable<{ taskId: string, expectation: number }> {
        return this.http.put<{ taskId: string, expectation: number }>(`${this.url}/push/${id}/publish`, { version });
    }

    public unpublished(id: string): Observable<ISchema[]> {
        return this.http.put<any[]>(`${this.url}/${id}/unpublish`, null);
    }

    public delete(id: string): Observable<ISchema[]> {
        return this.http.delete<any[]>(`${this.url}/${id}`);
    }

    public exportInFile(id: string): Observable<ArrayBuffer> {
        return this.http.get(`${this.url}/${id}/export/file`, {
            responseType: 'arraybuffer'
        });
    }

    public exportInMessage(id: string): Observable<ISchema[]> {
        return this.http.get<any[]>(`${this.url}/${id}/export/message`);
    }

    public pushImportByMessage(messageId: string, topicId: any): Observable<{ taskId: string, expectation: number }> {
        return this.http.post<{ taskId: string, expectation: number }>(`${this.url}/push/${topicId}/import/message`, { messageId });
    }

    public pushImportByFile(schemasFile: any, topicId: any): Observable<{ taskId: string, expectation: number }> {
        return this.http.post<{ taskId: string, expectation: number }>(`${this.url}/push/${topicId}/import/file`, schemasFile, {
            headers: {
                'Content-Type': 'binary/octet-stream'
            }
        });
    }

    public previewByMessage(messageId: string): Observable<ISchema> {
        return this.http.post<any>(`${this.url}/import/message/preview`, { messageId });
    }

    public pushPreviewByMessage(messageId: string): Observable<{ taskId: string, expectation: number }> {
        return this.http.post<{ taskId: string, expectation: number }>(`${this.url}/push/import/message/preview`, { messageId });
    }

    public previewByFile(schemasFile: any): Observable<ISchema[]> {
        return this.http.post<any[]>(`${this.url}/import/file/preview`, schemasFile, {
            headers: {
                'Content-Type': 'binary/octet-stream'
            }
        });
    }

    public createSystemSchemas(schema: Schema): Observable<ISchema> {
        const username = encodeURIComponent(this.auth.getUsername());
        return this.http.post<any>(`${this.url}/system/${username}`, schema);
    }

    public getSystemSchemas(pageIndex?: number, pageSize?: number): Observable<HttpResponse<ISchema[]>> {
        const username = encodeURIComponent(this.auth.getUsername());
        let url = `${this.url}/system/${username}`;
        if (Number.isInteger(pageIndex) && Number.isInteger(pageSize)) {
            url += `?pageIndex=${pageIndex}&pageSize=${pageSize}`;
        }
        return this.http.get<any>(url, { observe: 'response' });
    }

    public deleteSystemSchema(id: string): Observable<any> {
        return this.http.delete<any>(`${this.url}/system/${id}`);
    }

    public updateSystemSchema(schema: Schema, id?: string): Observable<ISchema[]> {
        const data = Object.assign({}, schema, { id: id || schema.id });
        return this.http.put<any[]>(`${this.url}/system/${id}`, data);
    }

    public activeSystemSchema(id: string): Observable<any> {
        return this.http.put<any>(`${this.url}/system/${id}/active`, null);
    }

    public getSystemSchemasByEntity(entity: SchemaEntity): Observable<ISchema> {
        return this.http.get<ISchema>(`${this.url}/system/entity/${entity}`);
    }
}
