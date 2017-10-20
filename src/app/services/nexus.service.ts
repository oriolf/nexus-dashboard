import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { User } from '../shared/models';

declare var nexus: any;

@Injectable()
export class NexusService {
  client: any;
  logged: boolean = false;

  constructor(
    private router: Router
  ) { }

  isLogged() { return this.logged; }

  // TODO handle errors correctly
  userListObservable(params: Observable<any>): Observable<User[]> {
    return new Observable(observer => {
      params.subscribe(p => {
        this.userList(p.prefix, p.limit, p.skip).then(res => {
          observer.next(res);
        });
      });
    });
  }

  userTotalObservable(prefix: Observable<string>): Observable<number> {
    return new Observable(observer => {
      prefix.subscribe(p => {
        this.userList(p, 0, 0).then(res => observer.next(res.length));
      });
    });
  }

  userTotal(prefix: string): Promise<number> {
    return this.userList(prefix, 0, 0).then(res => res.length);
  }

  userCreate(username: string, password: string): Promise<any> {
    return this.genericNexusFunction('userCreate', [username, password]);
  }

  userDelete(username: string): Promise<any> {
    return this.genericNexusFunction('userDelete', [username]);
  }

  userList(prefix: string, limit: number, skip: number): Promise<User[]> {
    return this.genericNexusFunction('userList', [prefix, limit, skip]);
  }

  taskPush(path: string, params: any, timeout: number): Promise<any> {
    return this.genericNexusFunction('taskPush', [path, params, timeout]);
  }

  logout() {
    this.client.close();
    this.client = null;
    location.reload();
  }

  login(user: string, password: string, host?: string) {
    if (!host) {
      host = 'ws://localhost:443';
    }

    var that = this;
    this.client = new Promise((res, rej) => {
      nexus.dial(host, function (client, err) {
        if (!err) {
          client.exec('sys.login', { 'user': user, 'pass': password }, (response, error) => {
            if (!error) {
              that.logged = true;
              res(client);
              that.router.navigate(['/users']);
            } else {
              client.close();
              rej(false);
            }
          });
        } else {
          console.error({ label: 'NexusService', humanLog: 'Dial failed: ', log: err });
          rej(false);
        }
      });
    });

    return this.client;
  }

  genericNexusFunction(func: string, params: any[]): Promise<any> {
    return new Promise((res, rej) => {
      this.client.then(c => {
        params.push((response, err) => {
          if (err) {
            rej(err);
          } else {
            res(response);
          }
        })
        c[func].apply(this, params);
      });
    });
  }

}
