// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'

import { EventEditComponent } from './components/event-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [EventEditComponent],
  exports: [CommonModule, FormsModule]
})
export class SharedModule { }
