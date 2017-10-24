import { Component, OnInit } from '@angular/core';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

import { Node } from '../../shared/models';
import { NexusService } from '../../services/nexus.service';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {
  dataSource: NodesDataSource | null;
  displayedColumns = ['node', 'version', 'clients', 'listening', 'load']

  constructor(
    private nexus: NexusService
  ) { }

  ngOnInit() {
    this.dataSource = new NodesDataSource(this.nexus);
  }

  formatLoad(load: { string: number }): string {
    return '' + load['Load1'] + ' / ' + load['Load5'] + ' / ' + load['Load15'];
  }

}

export class NodesDataSource extends DataSource<any> {
  constructor(
    private nexus: NexusService
  ) { super(); }

  connect(): Observable<Node[]> { return this.nexus.nodesObservable(); }
  disconnect() { }
}
