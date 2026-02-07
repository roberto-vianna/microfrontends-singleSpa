import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  exact: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  menuItems: MenuItem[] = [
    { 
      label: 'Novo Agendamento', 
      route: 'agendar', 
      icon: 'calendar_today', 
      exact: true,
    },
    { 
      label: 'Meus Agendamentos', 
      route: 'meus-agendamentos', 
      icon: 'list_alt', 
      exact: true,
    },
    { 
      label: 'Perfil', 
      route: 'perfil', 
      icon: 'person', 
      exact: true,
    }
  ];

  activeRoute: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.setInitialActiveRoute(); 
    this.trackRouteChanges();
  }
  private setInitialActiveRoute() {
    const currentUrl = this.router.url.split('/');
    this.activeRoute = currentUrl[currentUrl.length - 1];
  }
  private trackRouteChanges() {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(event => {
        const urlSegments = event.urlAfterRedirects.split('/');
        this.activeRoute = urlSegments[urlSegments.length - 1];
      });
  }

  handleNavigation(item: MenuItem) {
    if (!item.disabled) {
      this.router.navigate([`/cliente/${item.route}`]);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
  window.location.href = "http://localhost:8081/login";
}
}
