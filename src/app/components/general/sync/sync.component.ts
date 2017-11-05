import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

import { NexusService } from '../../../services/nexus.service';
import { MacrosService } from '../../../services/macros.service';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.css']
})
export class SyncComponent implements OnInit {
  dataSource: LocksDataSource | null;
  displayedColumns = ['actions', 'name'];
  newLock = new FormControl('');
  changes: EventEmitter<any> = new EventEmitter();

  constructor(
    private nexus: NexusService,
    private macros: MacrosService
  ) { }

  ngOnInit() {
    this.dataSource = new LocksDataSource(this.changes);
  }
  
  unlock(name: string) {
    this.macros.directAction(
      'Could not unlock path ' + name + ': ',
      () => this.nexus.unlock(name),
      () => {
        this.dataSource.delete(name);
        this.changes.emit(null);
      }
    );
  }

  lock() {
    this.macros.directAction(
      'Could not lock path ' + this.newLock.value + ': ',
      () => this.nexus.lock(this.newLock.value),
      () => {
        this.dataSource.add(this.newLock.value);
        this.changes.emit(null);
      }
    );
  }

}

export class LocksDataSource extends DataSource<any> {
  locks: any[] = [];

  constructor(
    private changes: Observable<any>
  ) { super(); }

  connect(): Observable<any[]> {
    return new Observable(observer => {
      observer.next(this.locks.concat({ lock: true }));
      this.changes.subscribe(() => {
        observer.next(this.locks.concat({ lock: true }));
      });
    });
  }
  disconnect() { }
  add(name) { this.locks.push(name); }
  delete(name) {
    let index = this.locks.indexOf(name);
    if (index !== -1) {
      this.locks.splice(index, 1);
    }
  }

}