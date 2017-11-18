import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NexusService } from '../../../services/nexus.service';
import { MacrosService } from '../../../services/macros.service';

@Component({
  selector: 'app-pull',
  templateUrl: './pull.component.html',
  styleUrls: ['./pull.component.css']
})
export class PullComponent implements OnInit {
  form: FormGroup;
  task: any;
  taskstring: string = '';
  waiting: boolean = false;
  result: any = '';
  errordata: any = '';
  resultOrError = new FormControl('result');
  errorSchema = {
    "properties": {
      "code": { "type": "integer" },
      "message": { "type": "string" }
    }
  };

  constructor(
    private nexus: NexusService,
    private macros: MacrosService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      path: ['', Validators.required]
    });
  }

  pull() {
    this.waiting = true;
    this.macros.directActionFull(
      'Could not pull:',
      () => this.nexus.taskPull(this.form.get('path').value, 36001),
      task => {
        this.task = task;
        this.taskstring = JSON.stringify(this.task, null, 2);
      },
      err => {
        this.taskstring = '';
        this.task = undefined;
        this.waiting = false;
      }
    );
  }

  sendResult() {
    this.task.sendResult(
      this.result,
      (res, err) => {
        console.log('RESULT OF SEND RESULT:', res);
        console.log('ERROR OF SEND RESULT:', err);
        this.task = undefined;
        this.taskstring = '';
        this.waiting = false;
      }
    );
  }

  sendError(event) {
    this.task.sendError(
      event.code, event.message, this.errordata,
      (res, err) => {
        console.log('RESULT OF SEND ERROR:', res);
        console.log('ERROR OF SEND ERROR:', err);
        this.task = undefined;
        this.taskstring = '';
        this.waiting = false;
      }
    );
  }

}
