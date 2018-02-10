import { Component } from '@angular/core';

import { NexusService } from './services/nexus.service';
import { TranslateService } from '@ngx-translate/core';

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
        { name: 'Push', route: '/push', icon: 'arrow_forward' },
        { name: 'Pull', route: '/pull', icon: 'arrow_back' },
        { name: 'Services', route: '/services', icon: 'explore' }
      ]
    }
  ];

  constructor(
    public nexus: NexusService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  setLang(lang: string) { this.translate.use(lang); }

  logout() { this.nexus.logout(); }
}
