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
        { name: 'Sessions', route: '/sessions', icon: 'person_pin' },
      ]
    },
    {
      name: 'General',
      links: [
        { name: 'Nodes', route: '/nodes', icon: 'cloud' },
        { name: 'Tareas 1', route: '/dashboard', icon: 'build' }
      ]
    }
  ];

  constructor(
    private nexus: NexusService
  ) { }

  logout() { this.nexus.logout(); }
}
