import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { MinistryCategoriesComponent } from './pages/ministry-categories/ministry-categories.component';
import { EventRegistrationComponent } from './pages/event-registration/event-registration.component';
import { ApprovalsComponent } from './pages/approvals/approvals.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'users', 
    component: UserManagementComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'ministry-categories', 
    component: MinistryCategoriesComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'event-registration', 
    component: EventRegistrationComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'approvals', 
    component: ApprovalsComponent, 
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '/login' }
];
