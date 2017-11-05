import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { User, UserSessions, Node, Session } from '../shared/models';

declare var nexus: any;

@Injectable()
export class NexusService {
  client: any;
  clientversion: string;
  nexusversion: string;
  logged: boolean = false;

  constructor(
    private router: Router
  ) { }

  isLogged() { return this.logged; }

  clientVersion() { return this.clientversion; }
  version() { return this.nexusversion; }

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

  sessionsObservable(changes: Observable<any>): Observable<Session[]> {
    return new Observable(observer => {
      changes.subscribe(p => {
        this.sessionList(p.prefix, 0, 0).then(res => {
          observer.next(this.expandSessions(res));
        });
      });
    });
  }

  expandSessions(userSessions: UserSessions[]): Session[] {
    let sessions: Session[] = [];
    for (let userSession of userSessions) {
      for (let session of userSession.Sessions) {
        sessions.push(new Session(
          userSession.User,
          session.Id,
          session.RemoteAddress,
          session.Protocol,
          session.CreationTime
        ));
      }
    }
    return sessions;
  }

  sessionKick(connID: string): Promise<any> {
    return this.genericNexusFunction('sessionKick', [connID]);
  }

  sessionReload(connID: string): Promise<any> {
    return this.genericNexusFunction('sessionReload', [connID]);
  }

  lock(name: string): Promise<any> {
    return this.genericNexusFunction('lock', [name]);
  }

  unlock(name: string): Promise<any> {
    return this.genericNexusFunction('unlock', [name]);
  }

  nodesObservable(): Observable<Node[]> {
    return new Observable(observer => {
      this.nodeList(0, 0).then(res => observer.next(res));
    });
  }

  nodeList(limit: number, skip: number): Promise<any> {
    return this.genericNexusFunction('nodeList', [limit, skip]);
  }

  UserAddTemplate(user: string, template: string): Promise<any> {
    return this.genericNexusFunction('userAddTemplate', [user, template]);
  }

  UserDelTemplate(user: string, template: string): Promise<any> {
    return this.genericNexusFunction('userDelTemplate', [user, template]);
  }

  UserAddWhitelist(user: string, ip: string): Promise<any> {
    return this.genericNexusFunction('userAddWhitelist', [user, ip]);
  }

  UserDelWhitelist(user: string, ip: string): Promise<any> {
    return this.genericNexusFunction('userDelWhitelist', [user, ip]);
  }

  UserAddBlacklist(user: string, ip: string): Promise<any> {
    return this.genericNexusFunction('userAddBlacklist', [user, ip]);
  }

  UserDelBlacklist(user: string, ip: string): Promise<any> {
    return this.genericNexusFunction('userDelBlacklist', [user, ip]);
  }

  UserGetTags(user: string): Promise<any> {
    return this.genericNexusFunction('userGetTags', [user]);
  }

  userDelTags(user: string, path: string, tags: string[]): Promise<any> {
    return this.genericNexusFunction('userDelTags', [user, path, tags]);
  }

  userSetPass(user: string, password: string): Promise<any> {
    return this.genericNexusFunction('userSetPass', [user, password]);
  }

  userSetMaxSessions(user: string, maxSessions: number): Promise<any> {
    return this.genericNexusFunction('userSetMaxSessions', [user, maxSessions]);
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

  userSetDisabled(username: string, disabled: boolean): Promise<any> {
    return this.genericNexusFunction('userSetDisabled', [username, disabled]);
  }

  userList(prefix: string, limit: number, skip: number): Promise<User[]> {
    return this.genericNexusFunction('userList', [prefix, limit, skip]);
  }

  sessionList(prefix: string, limit: number, skip: number): Promise<UserSessions[]> {
    return this.genericNexusFunction('sessionList', [prefix, limit, skip]);
  }

  taskPush(path: string, params: any, timeout: number): Promise<any> {
    return this.genericNexusFunction('taskPush', [path, params, timeout]);
  }

  logout() {
    this.client.then(client => client.close());
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
              that.clientversion = client.version();
              that.nexusversion = client.nexusVersion();
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
