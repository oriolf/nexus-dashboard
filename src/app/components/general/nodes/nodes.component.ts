import { Component, OnInit } from '@angular/core';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

import { Node } from '../../../shared/models';
import { formatLoad } from '../../../shared/functions';
import { NexusService } from '../../../services/nexus.service';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {
  dataSource: NodesDataSource | null;
  displayedColumns = ['node', 'version', 'clients', 'listening', 'load'];

  constructor(
    private nexus: NexusService
  ) { }

  ngOnInit() {
    this.dataSource = new NodesDataSource(this.nexus);
  }

  formatLoad(load: { string: number }): string { return formatLoad(load); }
}

export class NodesDataSource extends DataSource<any> {
  constructor(
    private nexus: NexusService
  ) { super(); }

  connect(): Observable<Node[]> { return this.nexus.nodesObservable(); }
  disconnect() { }
}
