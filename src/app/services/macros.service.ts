import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';

import { AreYouSureDialogComponent } from '../components/shared/are-you-sure-dialog/are-you-sure-dialog.component';

@Injectable()
export class MacrosService {

  constructor(
    public snackBar: MatSnackBar,
    public AreYouSureDialog: MatDialog
  ) { }

  areYouSureAction(
    text: string,
    errorText: string,
    action: any,
    thenAction: any
  ) {
    let dialogRef = this.AreYouSureDialog.open(AreYouSureDialogComponent, {
      width: '400px',
      data: { text: text }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        action().then(() => {
          thenAction();
        }).catch(err => {
          this.snackBar.open(errorText + err.message, 'OK');
        });
      }
    })
  }

  directAction(
    errorText: string,
    action: any,
    thenAction: any
  ) {
    action().then(() => {
      thenAction();
    }).catch(err => {
      this.snackBar.open(errorText + err.message, 'OK');
    });
  }

}
