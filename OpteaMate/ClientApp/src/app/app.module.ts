// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { SharedModule } from './shared/shared.module'
import { CreateModule } from './create/create.module'
import { EnrollModule } from './enroll/enroll.module'

import { AppComponent } from './app.component'
import { AdminComponent } from './admin/admin.component'
import { NotfoundComponent } from './notfound/notfound.component';
import { HomeComponent } from './create/home.component'
import { SeriesComponent } from './create/series.component'
import { RegistrationComponent } from './enroll/registration.component'

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FormsModule,
    RouterModule.forRoot([
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'series/:seriestoken', component: SeriesComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'enroll/:eventtoken', component: RegistrationComponent },
    { path: '404', component: NotfoundComponent },
    { path: '**', redirectTo: '/404' }
], { relativeLinkResolution: 'legacy' }),
    BrowserAnimationsModule,
    SharedModule,
    CreateModule,
    EnrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
