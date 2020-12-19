// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'

import { RegistrationComponent } from './registration.component'
import { RegistrationRosterPipe } from './registration-role-pipes'
import { RegistrationScratchPipe } from './registration-role-pipes';
import { RegistrationEditComponent } from './registration-edit/registration-edit.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [
    RegistrationComponent,
    RegistrationRosterPipe,
    RegistrationScratchPipe,
    RegistrationEditComponent
  ],
  exports: [CommonModule, FormsModule]
})
export class EnrollModule { }
