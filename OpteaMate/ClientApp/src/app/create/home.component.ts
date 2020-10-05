// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, Inject, OnInit  } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms'
import { NativeDateAdapter, DateAdapter, ErrorStateMatcher } from '@angular/material/core'
import { Guid } from '../common/guid.component';

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date): string {
    return date.toLocaleDateString()
  }
}

export class DatepickerComponent implements OnInit {
  constructor() { }
  date: any;
  ngOnInit() {
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  inError: boolean = true
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    this.inError = !!(control && control.invalid && (control.dirty || control.touched))
    return this.inError
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter }
  ]
})

export class HomeComponent {

  matcher = new MyErrorStateMatcher();
  newEvent: EventData = new EventData()
  optima: OptimumResponse[]

  selectedOptimum: OptimumResponse
  selectedDate = new Date();
  selectedHour: number = 19;
  selectedMinutes: number = 0;
  nextSeriesToken: string

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    @Inject('BASE_URL') private readonly baseUrl: string) {

    let request = this.baseUrl + 'api/optima/'
    this.http.get<OptimaResponse>(request)
      .subscribe(result => {
        console.log(result)
        this.optima = result.data
        this.selectedOptimum = this.optima[1]
        this.nextSeriesToken = Guid.newGuid()
      }, error => console.error(error))
  }

  addEvent() {
    this.newEvent.start = this.selectedDate
    this.newEvent.optimumDboId = this.selectedOptimum.data.optimumDboId
    this.newEvent.start.setHours(this.selectedHour, this.selectedMinutes, 0, 0)

    let request = this.baseUrl + 'api/events'
    this.http.post<EventResponse>(request, this.newEvent).
      subscribe(result => {
        console.info(result.data.eventToken)
        this.router.navigate(['/enroll/' + result.data.eventToken])
      }, error => console.error(error))
  }

}

interface OptimumData {
  optimumDboId: number
  name: string
  strategies: string
  positions: string
}

interface OptimumResponse {
  data: OptimumData
}

interface OptimaResponse {
  data: OptimumResponse[]
}

export class EventData {
  eventToken: string
  title: string
  location: string
  start: Date
  optimumDboId: number
}

interface EventResponse {
  data: EventData
  links: { [key: string]: string; };
}
