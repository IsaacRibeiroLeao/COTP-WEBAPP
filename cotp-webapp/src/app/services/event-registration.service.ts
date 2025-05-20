import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  ministryId: number;
  ministryName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventCount {
  count: number;
}

// Type for direct number response
export type NumberResponse = number;

@Injectable({
  providedIn: 'root'
})
export class EventRegistrationService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getEventCount(): Observable<EventCount> {
    return this.http.get<NumberResponse>(`${this.apiUrl}/count`).pipe(
      map(count => ({ count }))
    );
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  updateEvent(id: number, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
