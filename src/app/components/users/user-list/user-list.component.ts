import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { User } from '../../../shared/models';
import { NexusService } from '../../../services/nexus.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  lengthUpdated: EventEmitter<any> = new EventEmitter();
  updateLength: EventEmitter<any> = new EventEmitter();
  prefix = new FormControl('');
  displayedColumns = ['actions', 'username', 'maxSessions', 'enabled'];
  dataSource: UserDataSource | null;
  triggerUpdateUsers: EventEmitter<any> = new EventEmitter;

  constructor(
    private nexus: NexusService
  ) { }

  ngOnInit() {
    this.dataSource = new UserDataSource(this.nexus, this.paginator, this.triggerUpdateUsers);
    this.subscribeUsersLength();
    this.updateLength.emit(null); // trigger first get users
  }

  subscribeUsersLength() {
    Observable.merge(...[
      this.updateLength,
      this.prefix.valueChanges.debounceTime(300),
      this.paginator.page
    ]).subscribe(() => {
      this.nexus.userTotal(this.prefix.value).then(total => {
        this.paginator.length = total;
        this.triggerUpdateUsers.emit({
          prefix: this.prefix.value,
          limit: this.paginator.pageSize,
          skip: this.paginator.pageSize * this.paginator.pageIndex
        });
      });
    });
  }

  userAdd() {
    this.updateLength.emit(null);
  }

  userDelete(username: string) {
    console.log('User deleted:', username);
    this.updateLength.emit(null);
  }

}

export class UserDataSource extends DataSource<any> {
  constructor(
    private nexus: NexusService,
    private _paginator: MatPaginator,
    private changes: Observable<any>
  ) { super(); }

  connect(): Observable<User[]> { return this.nexus.userListObservable(this.changes); }
  disconnect() { }
}
