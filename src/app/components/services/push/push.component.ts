import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NexusService } from '../../../services/nexus.service';
import { MacrosService } from '../../../services/macros.service';

@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.css']
})
export class PushComponent implements OnInit {
  pushParams: any = '';
  result: string = '';
  error: string = '';
  form: FormGroup;

  constructor(
    private nexus: NexusService,
    private fb: FormBuilder,
    private macros: MacrosService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      path: ['', Validators.required]
    });
  }

  push() {
    this.nexus.taskPush(this.form.get('path').value, this.pushParams, 1).then(res => {
      this.result = JSON.stringify(res, null, 2);
      this.error = '';
    }).catch(err => {
      this.result = '';
      this.error = JSON.stringify(err, null, 2);
    });
  }

}
