import { Component } from '@angular/core';

import { NexusService } from './services/nexus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  linkGroups = [
    {
      name: 'Usuarios',
      links: [
        { name: 'Usuarios', route: '/users', icon: 'people' },
      ]
    },
    {
      name: 'Tareas',
      links: [
        { name: 'Tareas 1', route: '/dashboard', icon: 'build' },
      ]
    }
  ];

  constructor(
    private nexus: NexusService
  ) { }

  logout() { this.nexus.logout(); }
}
