import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

declare var nexus: any;

@Injectable()
export class NexusService {
  client: any;
  logged: boolean = false;

  constructor() { }

  isLogged() { return this.logged; }

  userList(prefix: string, limit: number, skip: number): Promise<any[]> {
    return this.genericNexusFunction('userList', [prefix, limit, skip]);
  }

  taskPush(path: string, params: any, timeout: number): Promise<any> {
    return this.genericNexusFunction('taskPush', [path, params, timeout]);
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
