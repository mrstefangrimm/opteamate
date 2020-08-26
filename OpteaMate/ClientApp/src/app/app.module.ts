// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { RouterModule } from '@angular/router'

import { AppComponent } from './app.component'
import { NavMenuComponent } from './nav-menu/nav-menu.component'
import { HomeComponent } from './home/home.component'
import { AdminComponent } from './admin/admin.component'
import { RegistrationComponent } from './enroll/registration.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatSliderModule } from '@angular/material/slider'
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'
import { RegistrationRosterPipe } from './enroll/registration-position-pipe'
import { RegistrationScratchPipe } from './enroll/registration-position-pipe'

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    AdminComponent,
    RegistrationComponent,
    RegistrationRosterPipe,
    RegistrationScratchPipe
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'admin', component: AdminComponent },
      { path: 'enroll/:eventtoken', component: RegistrationComponent }
    ]),
    BrowserAnimationsModule,
    MatSliderModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
