import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatPaginator } from '@angular/material';

import { ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

import { User } from '../../../shared/models';
import { NexusService } from '../../../services/nexus.service';
import { MacrosService } from '../../../services/macros.service';

import { UserCreateDialogComponent } from '../user-create-dialog/user-create-dialog.component';
import { AreYouSureDialogComponent } from '../../shared/are-you-sure-dialog/are-you-sure-dialog.component';

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
  USER_DELETE_TEXT = 'If you accept, the user will be permanently deleted.';
  DISABLE_TEXT = 'If you accept, the user will be disabled.';
  ENABLE_TEXT = 'If you accept, the user will be enabled.';

  constructor(
    private nexus: NexusService,
    private macros: MacrosService,
    public UserCreateDialog: MatDialog
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

  openUserCreateDialog(): void {
    let dialogRef = this.UserCreateDialog.open(UserCreateDialogComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { this.updateLength.emit(null); }
    });
  }

  userDelete(username: string) {
    this.macros.areYouSureAction(
      this.USER_DELETE_TEXT, 'Error deleting user: ',
      () => this.nexus.userDelete(username),
      () => this.updateLength.emit(null)
    );
  }

  setDisabled(username: string, disable: boolean) {
    let text = this.DISABLE_TEXT;
    if (!disable) { text = this.ENABLE_TEXT; }
    this.macros.areYouSureAction(
      text, 'Error changing user disabled state: ',
      () => this.nexus.userSetDisabled(username, disable),
      () => this.updateLength.emit(null)
    );
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
