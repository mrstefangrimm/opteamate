// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Inject, Component, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog'

@Component({
  selector: 'registration-edit',
  templateUrl: './registration-edit.component.html'
})

export class RegistrationEditComponent implements OnInit {

  registrationId: number
  registrationName: string
  registrationOffers: string
  canDelete: boolean

  constructor(
    private dialogRef: MatDialogRef<RegistrationEditComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.registrationId = data.registrationId
    this.registrationName = data.registrationName
    this.registrationOffers = data.registrationOffers
    this.canDelete = data.canDelete
  }

  ngOnInit() {
  }

  apply() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      registrationId: this.registrationId,
      registrationName: this.registrationName,
      registrationOffers: this.registrationOffers,
      deleteRegistration: false
    };
    this.dialogRef.close(dialogConfig)
  }

  delete() {
    if (confirm('Willst du \'' + this.registrationName + '\' für immer löschen?')) {
      const dialogConfig = new MatDialogConfig()
      dialogConfig.data = {
        registrationId: this.registrationId,
        deleteRegistration: true
      };
      this.dialogRef.close(dialogConfig)
    }
  }

  cancel() {
    this.dialogRef.close()
  }

}
