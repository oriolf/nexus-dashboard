import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NexusService } from '../../../services/nexus.service';
import { MacrosService } from '../../../services/macros.service';
import { User } from '../../../shared/models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  username: string;
  user: User;
  errMessage: string = '';
  formTemplate: FormGroup;
  formWhitelist: FormGroup;
  formBlacklist: FormGroup;

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
    this.route.paramMap.subscribe(params => {
      this.username = params.get('name');
      this.reloadUser();
    });
  }

  // TODO proper error handling
  reloadUser() {
    this.nexus.userList(this.username, 0, 0).then(res => {
      try {
        this.user = res.filter(x => x.User === this.username)[0];
      } catch (e) {
        this.errMessage = 'User does not exist';
      }
    });
  }

  addTemplate() { this.genericAction('Could not add template: ', () => this.nexus.UserAddTemplate(this.username, this.formTemplate.value['template'])); }
  deleteTemplate(template: string) { this.genericAction('Could not delete template: ', () => this.nexus.UserDelTemplate(this.username, template)); }
  addWhitelist() { this.genericAction('Could not add white list ip: ', () => this.nexus.UserAddWhitelist(this.username, this.formWhitelist.value['ip'])); }
  deleteWhitelist(ip: string) { this.genericAction('Could not delete white list ip: ', () => this.nexus.UserDelWhitelist(this.username, ip)); }
  addBlacklist() { this.genericAction('Could not add black list ip: ', () => this.nexus.UserAddBlacklist(this.username, this.formBlacklist.value['ip'])); }
  deleteBlacklist(ip: string) { this.genericAction('Could not delete black list ip: ', () => this.nexus.UserDelBlacklist(this.username, ip)); }

  genericAction(text: string, action: any) {
    this.macros.directAction(
      text,
      action,
      () => this.reloadUser()
    );
  }

}
