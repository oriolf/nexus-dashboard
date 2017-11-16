import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { NexusService } from '../../../services/nexus.service';

import { environment } from '../../../../environments/environment';
import { Max, Min, isPrefix } from '../../../shared/functions';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  services: any = {};
  serviceshow: string[] = [];
  servicepaths: string[] = [];
  prefix = new FormControl('');

  constructor(
    private nexus: NexusService
  ) { }

  ngOnInit() {
    this.listPulls();
    for (let i = 0; i < environment.services.length; i++) {
      let servicepath = environment.services[i];
      this.services[servicepath] = { pulls: 0 };
      this.servicepaths.push(servicepath);
      this.updateInfo(servicepath);
      this.updateSchema(servicepath);
    }

    this.serviceshow = this.servicepaths;
    this.prefix.valueChanges.subscribe(p => {
      this.serviceshow = [];
      for (let path of this.servicepaths) {
        if (isPrefix(p, path)) {
          this.serviceshow.push(path);
        }
      }
    });
  }

  listPulls() {
    for (let path in this.services) {
      this.services[path].pulls = 0;
    }
    this.nexus.taskList('', 0, 0).then(tasks => {
      for (let task of tasks) {
        if (task.Method === '') {
          let path = task.Path.slice(0, -1);
          if (this.services[path]) {
            this.services[path]['pulls']++;
          }
        }
      }
    });
  }

  updateInfo(servicepath: string) {
    this.nexus.taskPush(servicepath + '.@info', null, 5).then(res => {
      this.services[servicepath]['info'] = res;
    }).catch(err => console.log('Service @info error:', err));
  }

  updateSchema(servicepath: string) {
    this.nexus.taskPush(servicepath + '.@schema', null, 5).then(res => {
      this.services[servicepath]['schema'] = res;
      this.services[servicepath]['schemastring'] = JSON.stringify(res, null, 2);
    }).catch(err => console.log('Service @schema error:', err));
  }

  pingService(path: string) {
    this.services[path]['ping'] = undefined;
    let max = 0, min = 15000, avg = 0, i = 0;
    let start = new Date();
    let ping = () => {
      if (i === 10) {
        this.services[path]['ping'] = {
          max: max,
          min: min,
          avg: avg / 10
        };
        this.updateInfo(path);
        return;
      }
      i++;
      this.nexus.taskPush(path + '.@ping', null, 5).then(() => {
        let end = new Date();
        let timediff = end.getTime() - start.getTime();
        max = Max(max, timediff);
        min = Min(min, timediff);
        avg += timediff;
        start = new Date();
        ping();
      }).catch(() => {
        this.services[path]['info'] = undefined;
      });
    }
    ping();
  }

}
