import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NexusService } from '../../services/nexus.service';

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
    private nexus: NexusService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.loggingIn = true;
    let v = this.form.value;
    this.nexus.login(v.user, v.password);
  }

}
