import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showHeader = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Check current route immediately on init
    const currentUrl = this.router.url;
    this.showHeader = currentUrl !== '/' && !currentUrl.includes('/login');
    
    // Subscribe to future navigation events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !event.url.includes('/login') && event.url !== '/';
      }
    });
  }
}