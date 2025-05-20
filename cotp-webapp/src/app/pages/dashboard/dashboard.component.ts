import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { catchError, finalize, forkJoin, of } from 'rxjs';

import { UserService } from '../../services/user.service';
import { EventRegistrationService } from '../../services/event-registration.service';
import { ApprovalService } from '../../services/approval.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalUsers = 0;
  totalEvents = 0;
  pendingApprovals = 0;
  isLoading = true;
  apiError = false;

  constructor(
    private userService: UserService,
    private eventService: EventRegistrationService,
    private approvalService: ApprovalService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.apiError = false;

    // Use forkJoin to make parallel API requests
    forkJoin({
      users: this.userService.getUserCount().pipe(
        catchError(error => {
          console.error('Error fetching user count:', error);
          return of({ count: 0 });
        })
      ),
      events: this.eventService.getEventCount().pipe(
        catchError(error => {
          console.error('Error fetching event count:', error);
          return of({ count: 0 });
        })
      ),
      approvals: this.approvalService.getPendingApprovalsCount().pipe(
        catchError(error => {
          console.error('Error fetching pending approvals count:', error);
          return of({ count: 0 });
        })
      )
    }).pipe(
      catchError(error => {
        console.error('Error loading dashboard data:', error);
        this.apiError = true;
        // Return default values if API calls fail
        return of({
          users: { count: 0 },
          events: { count: 0 },
          approvals: { count: 0 }
        });
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(results => {
      this.totalUsers = results.users.count;
      this.totalEvents = results.events.count;
      this.pendingApprovals = results.approvals.count;
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}