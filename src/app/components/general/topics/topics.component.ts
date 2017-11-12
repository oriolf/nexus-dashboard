import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NexusService } from '../../../services/nexus.service';
import { MacrosService } from '../../../services/macros.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent implements OnInit {
  topicParams: any = '';
  form: FormGroup;
  formSubscribe: FormGroup;
  messages: string[] = [];
  subscribed: boolean = false;

  constructor(
    private nexus: NexusService,
    private fb: FormBuilder,
    private macros: MacrosService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      topic: ['', Validators.required]
    });
    this.formSubscribe = this.fb.group({
      topic: ['', Validators.required]
    });
  }

  publish() {
    let topic = this.form.get('topic').value;
    this.macros.directAction(
      'Could not publish on topic ' + topic + ': ',
      () => this.nexus.topicPublish(topic, this.topicParams),
      () => {}
    );
  }

  subscribe() {
    let pipe: any;
    this.nexus.pipeCreate().then(p => {
      pipe = p;
      return this.nexus.topicSubscribe(pipe, this.formSubscribe.get('topic').value)
    }).then(() => {
      this.subscribed = true;
      this.nexus.pipeObservable(pipe).subscribe(v => {
        this.messages.push(JSON.stringify(v, null, 2));
      });
    });
  }

}
