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
      name: 'General',
      links: [
        { name: 'Dasboard', route: '/dashboard', icon: 'dashboard' },
        { name: 'Nodes', route: '/nodes', icon: 'cloud' },
        { name: 'Topics', route: '/topics', icon: 'format_quote' },
        { name: 'Sync', route: '/sync', icon: 'lock'}
      ]
    },
    {
      name: 'Users',
      links: [
        { name: 'Users', route: '/users', icon: 'people' },
        { name: 'Sessions', route: '/sessions', icon: 'person_pin' },
      ]
    },
    {
      name: 'Services',
      links: [
        { name: 'Tasks', route: '/tasks', icon: 'assignment' },
        { name: 'Push', route: '/push', icon: 'send' },
        { name: 'Services', route: '/services', icon: 'explore' }
      ]
    }
  ];

  constructor(
    public nexus: NexusService
  ) { }

  logout() { this.nexus.logout(); }
}
