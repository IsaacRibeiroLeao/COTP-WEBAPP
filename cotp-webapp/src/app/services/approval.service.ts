import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Approval {
  id: number;
  requestType: string;
  requestId: number;
  requestDetails: any;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: number;
  requestedByName?: string;
  approvedBy?: number;
  approvedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalCount {
  count: number;
}

// Type for direct number response
export type NumberResponse = number;

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  private apiUrl = `${environment.apiUrl}/approvals`;

  constructor(private http: HttpClient) { }

  getApprovals(): Observable<Approval[]> {
    return this.http.get<Approval[]>(this.apiUrl);
  }

  getPendingApprovals(): Observable<Approval[]> {
    return this.http.get<Approval[]>(`${this.apiUrl}?status=pending`);
  }

  getPendingApprovalsCount(): Observable<ApprovalCount> {
    return this.http.get<NumberResponse>(`${this.apiUrl}/count?status=pending`).pipe(
      map(count => ({ count }))
    );
  }

  getApprovalById(id: number): Observable<Approval> {
    return this.http.get<Approval>(`${this.apiUrl}/${id}`);
  }

  createApproval(approval: Partial<Approval>): Observable<Approval> {
    return this.http.post<Approval>(this.apiUrl, approval);
  }

  updateApproval(id: number, approval: Partial<Approval>): Observable<Approval> {
    return this.http.put<Approval>(`${this.apiUrl}/${id}`, approval);
  }

  approveRequest(id: number): Observable<Approval> {
    return this.http.put<Approval>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectRequest(id: number): Observable<Approval> {
    return this.http.put<Approval>(`${this.apiUrl}/${id}/reject`, {});
  }
}
