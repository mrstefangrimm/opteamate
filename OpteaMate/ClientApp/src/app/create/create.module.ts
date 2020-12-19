// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'

import { HomeComponent } from './home.component';
import { SeriesComponent } from './series.component';
import { EventViewComponent } from './shared/event-view.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [HomeComponent, SeriesComponent, EventViewComponent],
  exports: [CommonModule, FormsModule]
})
export class CreateModule { }
