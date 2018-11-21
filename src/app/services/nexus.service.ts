import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { User, UserSessions, Node, Session, Task, NewTask } from '../shared/models';

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
        }).catch(e => console.log(e));
      });
    });
  }

  sessionsObservable(changes: Observable<any>): Observable<Session[]> {
    return new Observable(observer => {
      changes.subscribe(p => {
        this.sessionList(p.prefix, 0, 0).then(res => {
          observer.next(this.expandSessions(res));
        }).catch(e => console.log(e));
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

  // TODO add and use lockList, lockCount, topicList and topicCount

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
      this.nodeList(0, 0).then(res => observer.next(res)).catch(e => console.log(e));
    });
  }

  nodeList(limit: number, skip: number): Promise<Node[]> {
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

  userSetTags(user: string, path: string, tags: any): Promise<any> {
    return this.genericNexusFunction('userSetTags', [user, path, tags]);
  }

  userTotalObservable(prefix: Observable<string>): Observable<number> {
    return new Observable(observer => {
      prefix.subscribe(p => {
        this.userTotal(p).then(res => observer.next(res)).catch(e => console.log(e));
      });
    });
  }

  userTotal(prefix: string): Promise<number> {
    let ps = this.splitPathPrefixAndSuffix(prefix);
    return this.genericNexusFunction('userCountWithOpts', [ps[0], this.filter(ps[1])]).then(res => res.count);
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
    let ps = this.splitPathPrefixAndSuffix(prefix);
    return this.genericNexusFunction('userListWithOpts', [ps[0], limit, skip, this.filter(ps[1])]);
  }

  // TODO handle errors correctly
  // TODO unify with userListObservable to reuse the code
  taskListObservable(params: Observable<any>): Observable<Task[]> {
    return new Observable(observer => {
      params.subscribe(p => {
        this.taskList(p.prefix, p.limit, p.skip).then(res => {
          observer.next(res);
        }).catch(e => console.log(e));
      });
    });
  }

  taskTotal(prefix: string): Promise<number> {
    let ps = this.splitPathPrefixAndSuffix(prefix);
    return this.genericNexusFunction('taskCountWithOpts', [ps[0], this.filter(ps[1])]).then(res => res.count);
  }

  taskList(prefix: string, limit: number, skip: number): Promise<Task[]> {
    let ps = this.splitPathPrefixAndSuffix(prefix);
    return this.genericNexusFunction('taskListWithOpts', [ps[0], limit, skip, this.filter(ps[1])]).then(res => res.map(t => NewTask(t)));
  }

  sessionTotal(prefix: string): Promise<number> {
    let ps = this.splitPathPrefixAndSuffix(prefix);
    return this.genericNexusFunction('sessionCountWithOpts', [ps[0], this.filter(ps[1])]).then(res => res.count);
  }

  sessionList(prefix: string, limit: number, skip: number): Promise<UserSessions[]> {
    let ps = this.splitPathPrefixAndSuffix(prefix);
    return this.genericNexusFunction('sessionListWithOpts', [ps[0], limit, skip, this.filter(ps[1])]);
  }

  taskPush(path: string, params: any, timeout: number): Promise<any> {
    return this.genericNexusFunction('taskPush', [path, params, timeout]);
  }

  taskPull(path: string, timeout: number): Promise<any> {
    return this.genericNexusFunction('taskPull', [path, timeout]);
  }

  topicPublish(topic: string, params: any): Promise<any> {
    return this.genericNexusFunction('topicPublish', [topic, params]);
  }

  topicSubscribe(pipe: any, topic: string): Promise<any> {
    return this.genericNexusFunction('topicSubscribe', [pipe, topic]);
  }

  pipeCreate(): Promise<any> {
    return this.genericNexusFunction('pipeCreate', [{}]);
  }

  logout() {
    this.client.then(client => client.close());
    this.client = null;
    location.reload();
  }

  login(user: string, password: string) {
    var that = this;
    this.client = new Promise((res, rej) => {
      nexus.dial(environment.host, function (client, err) {
        if (!err) {
          client.exec('sys.login', { 'user': user, 'pass': password }, (response, error) => {
            if (!error) {
              that.logged = true;
              that.clientversion = client.version();
              that.nexusversion = client.nexusVersion();
              res(client);
              that.router.navigate(['/dashboard']);
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

  oneshotLogin(user: string, password: string) {
    return new Promise((res, rej) => {
      nexus.dial(environment.host, function (client, err) {
        if (!err) {
          client.exec('sys.login', { user: user, pass: password }, (response, error) => {
            if (!error) {
              client.close();
              res(null);
            } else {
              client.close();
              rej(error);
            }
          });
        } else {
          rej(err);
        }
      });
    });
  }

  genericNexusFunction(func: string, params: any[]): Promise<any> {
    return new Promise((res, rej) => {
      this.client.then(c => {
        params.push((response, err) => {
          if (err) {
            if (err.code === -32007) {
              setTimeout(() => { location.reload(); }, 2000);
            }
            rej(err);
          } else {
            res(response);
          }
        });
        c[func].apply(this, params);
      }).catch(e => rej(e));
    });
  }

  // TODO handle errors correctly
  pipeObservable(pipe: any): Observable<any> {
    return new Observable(observer => {
      let read = () => {
        pipe.read(1, 60, (response, err) => {
          if (!err && response.msgs[0]) {
            observer.next(response.msgs[0].msg.msg);
          }
          read();
        });
      }
      read();
    });
  }

  splitPathPrefixAndSuffix(path: string): string[] {
    let parts = path.split('.');
    let prefix = parts.slice(0, -1).join('.');
    let suffix = parts[parts.length-1];
    return [prefix, suffix];
  }

  filter(value: string) {
    return { 'Filter': value, 'LimitByDepth': false, 'Depth': -1 };
  }

}
