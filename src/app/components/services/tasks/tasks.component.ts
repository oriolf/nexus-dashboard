import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatPaginator } from '@angular/material';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

import { Task } from '../../../shared/models';
import { NexusService } from '../../../services/nexus.service';
import { MacrosService } from '../../../services/macros.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: TasksDataSource | null;
  prefix = new FormControl('');
  triggerUpdateTasks: EventEmitter<any> = new EventEmitter;
  updateLength: EventEmitter<any> = new EventEmitter();
  displayedColumns: string[] = ['session', 'id', 'path', 'method', 'user', 'status'];
  
  constructor(
    private nexus: NexusService,
    private macros: MacrosService,
  ) { }

  ngOnInit() {
    this.dataSource = new TasksDataSource(this.nexus, this.paginator, this.triggerUpdateTasks);
    this.subscribeTasksLength();
    this.updateLength.emit(null);
  }

  // TODO refactor in macros to reuse this and user-list
  subscribeTasksLength() {
    Observable.merge(...[
      this.prefix.valueChanges.debounceTime(300),
      this.paginator.page,
      this.updateLength
    ]).subscribe(() => {
      this.nexus.taskTotal(this.prefix.value).then(total => {
        this.paginator.length = total;
        this.triggerUpdateTasks.emit({
          prefix: this.prefix.value,
          limit: this.paginator.pageSize,
          skip: this.paginator.pageSize * this.paginator.pageIndex
        });
      });
    });
  }

}

export class TasksDataSource extends DataSource<any> {
  constructor(
    private nexus: NexusService,
    private _paginator: MatPaginator,
    private changes: Observable<any>
  ) { super(); }

  connect(): Observable<Task[]> { return this.nexus.taskListObservable(this.changes); }
  disconnect() { }
}