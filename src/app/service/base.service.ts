import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class BaseService<T> {
  protected constructor(protected http: HttpClient) {}

  protected abstract rootUrl(): string;

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.rootUrl());
  }

  save(entity: any): Observable<T> {
    return this.http.post<T>(this.rootUrl(), entity);
  }

  update(entity: any): Observable<T> {
    return this.http.put<T>(`${this.rootUrl()}/${entity.id}`, entity);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.rootUrl()}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.rootUrl()}/${id}`);
  }
}
