import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';

import { UserService, User } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  apiError = false;
  errorMessage = '';
  
  // Form management
  userForm: FormGroup;
  isEditing = false;
  currentUserId: number | null = null;
  showForm = false;
  
  // Filter and sort
  searchTerm = '';
  sortField = 'username';
  sortDirection = 'asc';
  
  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.apiError = false;
    
    this.userService.getUsers().pipe(
      catchError(error => {
        console.error('Erro ao carregar usuários:', error);
        this.apiError = true;
        this.errorMessage = error.message || 'Falha ao carregar usuários';
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(users => {
      this.users = users;
    });
  }
  
  // Form methods
  openAddUserForm(): void {
    this.isEditing = false;
    this.currentUserId = null;
    this.userForm.reset({
      role: 'user'
    });
    this.showForm = true;
  }
  
  openEditUserForm(user: User): void {
    this.isEditing = true;
    this.currentUserId = user.id;
    
    // Remove password validator for edit mode
    const passwordControl = this.userForm.get('password');
    if (passwordControl) {
      passwordControl.clearValidators();
      passwordControl.updateValueAndValidity();
    }
    
    this.userForm.patchValue({
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role
    });
    
    this.showForm = true;
  }
  
  cancelForm(): void {
    this.showForm = false;
    this.userForm.reset();
    
    // Restore password validator for next time
    if (this.isEditing) {
      const passwordControl = this.userForm.get('password');
      if (passwordControl) {
        passwordControl.setValidators([Validators.required, Validators.minLength(6)]);
        passwordControl.updateValueAndValidity();
      }
    }
  }
  
  submitForm(): void {
    if (this.userForm.invalid) {
      return;
    }
    
    const userData = this.userForm.value;
    
    if (this.isEditing && this.currentUserId) {
      // If password is empty in edit mode, remove it from the payload
      if (!userData.password) {
        delete userData.password;
      }
      
      this.userService.updateUser(this.currentUserId, userData).pipe(
        catchError(error => {
          console.error('Erro ao atualizar usuário:', error);
          this.errorMessage = error.message || 'Falha ao atualizar usuário';
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          this.loadUsers();
          this.showForm = false;
          this.userForm.reset();
        }
      });
    } else {
      this.userService.createUser(userData).pipe(
        catchError(error => {
          console.error('Erro ao criar usuário:', error);
          this.errorMessage = error.message || 'Falha ao criar usuário';
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          this.loadUsers();
          this.showForm = false;
          this.userForm.reset();
        }
      });
    }
  }
  
  deleteUser(userId: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.userService.deleteUser(userId).pipe(
        catchError(error => {
          console.error('Erro ao excluir usuário:', error);
          this.errorMessage = error.message || 'Falha ao excluir usuário';
          return of(null);
        })
      ).subscribe(() => {
        this.loadUsers();
      });
    }
  }
  
  // Filter and sort methods
  get filteredUsers(): User[] {
    return this.users
      .filter(user => {
        if (!this.searchTerm) return true;
        
        const term = this.searchTerm.toLowerCase();
        return (
          user.username.toLowerCase().includes(term) ||
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.role.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        const fieldA = String(a[this.sortField as keyof User] || '').toLowerCase();
        const fieldB = String(b[this.sortField as keyof User] || '').toLowerCase();
        
        if (this.sortDirection === 'asc') {
          return fieldA.localeCompare(fieldB);
        } else {
          return fieldB.localeCompare(fieldA);
        }
      });
  }
  
  setSortField(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }
  
  refreshData(): void {
    this.loadUsers();
  }
}
