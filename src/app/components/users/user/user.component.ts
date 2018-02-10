import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NexusService } from '../../../services/nexus.service';
import { MacrosService } from '../../../services/macros.service';
import { User, UserSessions } from '../../../shared/models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  username: string;
  reloading: boolean = false;
  user: User;
  sessions: UserSessions;
  tags: string;
  effectivetags: string;
  errMessage: string = '';
  formTemplate: FormGroup;
  formWhitelist: FormGroup;
  formBlacklist: FormGroup;
  formEditPassword: FormGroup;
  addTagsForm: FormGroup;
  tryPasswordSchema: any = {
    properties: {
      password: { type: 'string', widget: 'password' }
    },
    required: ['password']
  };
  editMaxsessionsSchema: any = {
    properties: {
      maxSessions: { type: 'number' },
    },
    required: ['maxSessions']
  };
  tagValue = '';

  constructor(
    private route: ActivatedRoute,
    private nexus: NexusService,
    private fb: FormBuilder,
    private macros: MacrosService
  ) { }

  ngOnInit() {
    this.formTemplate = this.fb.group({ template: ['', Validators.required] });
    this.formWhitelist = this.fb.group({ ip: ['', Validators.required] });
    this.formBlacklist = this.fb.group({ ip: ['', Validators.required] });
    this.addTagsForm = this.fb.group({
      path: ['', Validators.required],
      tag: ['', Validators.required]
    });
    this.formEditPassword = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.matchingPasswords });
    this.route.paramMap.subscribe(params => {
      this.username = params.get('name');
      this.reloadUser();
    });
  }

  // TODO proper error handling
  reloadUser() {
    this.reloading = true;
    this.nexus.userList(this.username, 0, 0).then(res => {
      try {
        this.user = res.filter(x => x.User === this.username)[0];
        this.tags = JSON.stringify(this.user.Tags, null, 2);
      } catch (e) {
        this.errMessage = 'User does not exist';
      }
      this.reloading = false;
    });

    this.nexus.UserGetTags(this.username).then(res => {
      this.effectivetags = JSON.stringify(res.tags, null, 2);
    });

    this.nexus.sessionList(this.username, 0, 0).then(res => {
      try {
        this.sessions = res.filter(x => x.User === this.username)[0];
      } catch (e) { }
    })
  }

  deleteTag(path: string, key: string) { this.genericAction('Error deleting tag: ', () => this.nexus.userDelTags(this.user.User, path, [key])); }
  toggleDisabled() { this.genericAction('Error changing user disabled state: ', () => this.nexus.userSetDisabled(this.user.User, !this.user.Disabled)); }
  addTemplate() { this.genericAction('Could not add template: ', () => this.nexus.UserAddTemplate(this.username, this.formTemplate.value['template'])); }
  deleteTemplate(template: string) { this.genericAction('Could not delete template: ', () => this.nexus.UserDelTemplate(this.username, template)); }
  addWhitelist() { this.genericAction('Could not add white list ip: ', () => this.nexus.UserAddWhitelist(this.username, this.formWhitelist.value['ip'])); }
  deleteWhitelist(ip: string) { this.genericAction('Could not delete white list ip: ', () => this.nexus.UserDelWhitelist(this.username, ip)); }
  addBlacklist() { this.genericAction('Could not add black list ip: ', () => this.nexus.UserAddBlacklist(this.username, this.formBlacklist.value['ip'])); }
  deleteBlacklist(ip: string) { this.genericAction('Could not delete black list ip: ', () => this.nexus.UserDelBlacklist(this.username, ip)); }
  editPassword() { this.genericAction('Could not change user password: ', () => this.nexus.userSetPass(this.username, this.formEditPassword.value['password'])); }
  editMaxsessions(event) { this.genericAction('Could not change max sessions: ', () => this.nexus.userSetMaxSessions(this.username, event.maxSessions)); }
  addTag() {
    let path = this.addTagsForm.get('path').value;
    let tag = this.addTagsForm.get('tag').value;
    let tags = {};
    tags[tag] = this.tagValue;
    this.genericAction('Could not add tags: ', () => this.nexus.userSetTags(this.username, path, tags));
  }
  tryPassword(event) {
    this.macros.directActionWithConfirmation(
      'Login successful!',
      'Could not log in: ',
      () => this.nexus.oneshotLogin(this.username, event.password),
      () => { }
    );
  }

  genericAction(text: string, action: any) {
    this.macros.directAction(
      text,
      action,
      () => this.reloadUser()
    );
  }

  matchingPasswords(group: FormGroup): {[key: string]: any} {
    let password = group.controls['password'];
    let confirmPassword = group.controls['confirmPassword'];

    if (password.value !== confirmPassword.value) {
      return { mismatchedPasswords: true };
    }
  }

  format(value: any) { return JSON.stringify(value); }

}
