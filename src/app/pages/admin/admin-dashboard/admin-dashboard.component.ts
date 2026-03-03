import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  stats: any = {};
  loading = true;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.adminService.getDashboard().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/admin/login']);
      }
    });
  }

  goTo(page: string) {
    this.router.navigate(['/admin/' + page]);
  }

  logout() {
    this.adminService.logout().subscribe({
      next: () => this.router.navigate(['/admin/login']),
      error: () => this.router.navigate(['/admin/login'])
    });
  }
}