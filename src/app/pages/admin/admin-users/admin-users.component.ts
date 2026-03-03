import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {

  users: any[] = [];
  loading = true;
  showForm = false;
  error = '';
  success = '';

  newUser = {
    fullName: '',
    email: '',
    phone: '',
    initialBalance: 0,
    pin: ''
  };

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/admin/login']);
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.error = '';
    this.success = '';
  }

  createUser() {
    if (!this.newUser.fullName || !this.newUser.pin) {
      this.error = 'Nom et PIN sont obligatoires';
      return;
    }
    this.adminService.createUser(this.newUser).subscribe({
      next: () => {
        this.success = 'Utilisateur créé avec succès !';
        this.showForm = false;
        this.newUser = { fullName: '', email: '', phone: '', initialBalance: 0, pin: '' };
        this.loadUsers();
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la création';
      }
    });
  }

  goTo(page: string) { this.router.navigate(['/admin/' + page]); }

  logout() {
    this.adminService.logout().subscribe({
      next: () => this.router.navigate(['/admin/login']),
      error: () => this.router.navigate(['/admin/login'])
    });
  }
}