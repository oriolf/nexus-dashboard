import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';

import { Session } from '../../../shared/models';
import { NexusService } from '../../../services/nexus.service';
import { MacrosService } from '../../../services/macros.service';


@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {
  dataSource: SessionDataSource | null;
  prefix = new FormControl('');
  kicked: EventEmitter<any> = new EventEmitter();
  displayedColumns: string[] = ['actions', 'username', 'id', 'remoteAddress', 'protocol', 'creationTime'];
  
  constructor(
    private nexus: NexusService,
    private macros: MacrosService
  ) { }

  ngOnInit() {
    let changes = new EventEmitter();
    Observable.merge(...[
      this.kicked,
      this.prefix.valueChanges.debounceTime(300)
    ]).subscribe(() => {
      changes.emit({ prefix: this.prefix.value });
    });
    this.dataSource = new SessionDataSource(this.nexus, changes);
    setTimeout(() => this.kicked.emit(null), 50);
  }

  sessionKick(connID: string) {
    this.macros.directAction(
      'Could not kick session: ', 
      () => this.nexus.sessionKick(connID),
      () => this.kicked.emit(null)
    );
  }
  sessionReload(connID: string) {
    this.macros.directAction(
      'Could not reload session: ',
      () => this.nexus.sessionReload(connID),
      () => {}
    );
  }

  formatTime(time: string) { return new Date(time).toLocaleString(); }

}

export class SessionDataSource extends DataSource<any> {
  constructor(
    private nexus: NexusService,
    private changes: Observable<any>
  ) { super(); }

  connect(): Observable<Session[]> { return this.nexus.sessionsObservable(this.changes); }
  disconnect() { }
}