import { Component, OnInit, OnDestroy } from '@angular/core';

import { NexusService } from '../../../services/nexus.service';
import { formatLoad } from '../../../shared/functions';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  loadingServices: boolean = true;
  loadingUsers: boolean = true;
  loadingTasks: boolean = true;
  loadingNodes: boolean = true;
  totalServices: number = environment.services.length;
  services: number = 0;
  users: number = 0;
  tasks: number = 0;
  nodes: any = {};
  interval: any;

  constructor(
    private nexus: NexusService
  ) { }

  ngOnInit() {
    this.reloadInfo();
    this.interval = setInterval(() => {
      this.reloadInfo();
    }, 60000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  reloadInfo() {
    this.loadingServices = true;
    this.loadingUsers = true;
    this.loadingTasks = true;
    this.loadingNodes = true;

    this.nexus.userTotal('').then(res => {
      this.users = res;
      this.loadingUsers = false;
    }).catch(err => console.log('Error getting user total:', err));

    this.nexus.taskTotal('').then(res => {
      this.tasks = res;
      this.loadingTasks = false;
    }).catch(err => console.log('Error getting task total:', err));

    this.nexus.nodeList(0, 0).then(nodes => {
      this.nodes.count = nodes.length;
      this.nodes.Load = { Load1: 0, Load5: 0, Load15: 0 };
      for (let node of nodes) {
        this.nodes.Load['Load1'] += node.Load['Load1'];
        this.nodes.Load['Load5'] += node.Load['Load5'];
        this.nodes.Load['Load15'] += node.Load['Load15'];
      }
      this.loadingNodes = false;
    }).catch(err => console.log('Error getting nodes:', err));

    let servicesVisited = 0;
    this.services = 0;
    for (let service of environment.services) {
      this.nexus.taskPush(service + '.@info', null, 2).then(() => {
        servicesVisited++;
        this.services++;
        if (servicesVisited === this.totalServices) {
          this.loadingServices = false;
        }
      }).catch(() => {
        servicesVisited++;
        if (servicesVisited === this.totalServices) {
          this.loadingServices = false;
        }
      });
    }
  }

  formatLoad(load: { string: number }): string { return formatLoad(load); }
}
