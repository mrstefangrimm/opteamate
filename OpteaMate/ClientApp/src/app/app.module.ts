// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { RouterModule } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatNativeDateModule } from '@angular/material/core'
import { MatSliderModule } from '@angular/material/slider'
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'

import { AppComponent } from './app.component'
import { HomeComponent } from './create/home.component'
import { SeriesComponent } from './create/series.component'
import { AdminComponent } from './admin/admin.component'
import { RegistrationComponent } from './enroll/registration.component'
import { RegistrationRosterPipe } from './enroll/registration-position-pipe'
import { RegistrationScratchPipe } from './enroll/registration-position-pipe';
import { NotfoundComponent } from './notfound/notfound.component';
import { EventEditComponent } from './nested-views/event-edit.component'
import { EventViewComponent } from './nested-views/event-view.component'
import { RegistrationEditComponent } from './nested-views/registration-edit.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SeriesComponent,
    AdminComponent,
    RegistrationComponent,
    RegistrationRosterPipe,
    RegistrationScratchPipe,
    NotfoundComponent,
    EventEditComponent,
    EventViewComponent,
    RegistrationEditComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'series/:seriestoken', component: SeriesComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'enroll/:eventtoken', component: RegistrationComponent },
      { path: '404', component: NotfoundComponent },
      { path: '**', redirectTo: '/404' }
    ]),
    BrowserAnimationsModule,
    MatSliderModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
