import { MatSelect } from '@angular/material';
import { Component, OnInit, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NexusService } from '../../services/nexus.service';
declare var JSONEditor;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loggingIn: boolean = false;
  hide: boolean = true;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private nexus: NexusService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // TODO handle errors
  login() {
    this.loggingIn = true;
    let v = this.form.value;
    this.nexus.login(v.user, v.password);
  }

}
