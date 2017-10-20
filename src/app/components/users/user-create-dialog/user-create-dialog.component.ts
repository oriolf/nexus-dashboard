import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';

import { NexusService } from '../../../services/nexus.service';

@Component({
  selector: 'app-user-create-dialog',
  templateUrl: './user-create-dialog.component.html',
  styleUrls: ['./user-create-dialog.component.css']
})
export class UserCreateDialogComponent implements OnInit {
  form: FormGroup;
  creating: boolean = false;
  hide: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<UserCreateDialogComponent>,
    private fb: FormBuilder,
    private nexus: NexusService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  createUser() {
    this.creating = true;
    let v = this.form.value;
    this.nexus.userCreate(v.user, v.password).then(res => {
      this.dialogRef.close(true);
    }).catch(err => {
      this.snackBar.open('Error creating user: ' + err.message, 'OK');
      this.dialogRef.close(false);
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

}
