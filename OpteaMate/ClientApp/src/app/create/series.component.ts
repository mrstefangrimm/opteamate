// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, Inject, OnInit  } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms'
import { NativeDateAdapter, DateAdapter, ErrorStateMatcher } from '@angular/material/core'

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
  templateUrl: './series.component.html',
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter }
  ]
})

export class SeriesComponent {

  events: EventResponse[]
  matcher = new MyErrorStateMatcher();
  newEvent: EventData = new EventData()
  seriesToken: string = "N/A"
  selectedOptimum: OptimumResponse
  optima: OptimumResponse[]
  selectedHour: number = 19;
  selectedMinutes: number = 0;
  selectedDate = new Date();
  seriesUrl: string

  constructor(private route: ActivatedRoute,
    private readonly http: HttpClient,
    @Inject('BASE_URL') private readonly baseUrl: string) {

    this.route.params.subscribe(params => {
      this.seriesToken = params.seriestoken
      this.seriesUrl = this.baseUrl + "series/" + this.seriesToken
      this.getEventsBySeriesToken()
    })

    let request = this.baseUrl + 'api/optima/'
    this.http.get<OptimaResponse>(request)
      .subscribe(result => {
        console.log(result)
        this.optima = result.data
        this.selectedOptimum = this.optima[1]
      }, error => console.error(error))
  }

  getLink(eventToken: string) {
    return "/enroll/" + eventToken
  }

  getLocaleDt(dat: Date) {
    let dt = new Date(dat)
    let dtMs = dt.getTime() - dt.getTimezoneOffset() * 60000
    dt.setTime(dtMs)
    return dt
  }

  addEvent() {
    this.newEvent.start = this.selectedDate
    this.newEvent.start.setHours(this.selectedHour, this.selectedMinutes, 0, 0)
    console.info(this.newEvent.start)
    this.newEvent.optimumDboId = this.selectedOptimum.data.optimumDboId
    this.newEvent.seriesToken = this.seriesToken

    let request = this.baseUrl + 'api/events'
    this.http.post<EventData>(request, this.newEvent).subscribe(result => {
      this.getEventsBySeriesToken()
    }, error => console.error(error))
  }

  deleteEvent(evtId: string) {
    let request = this.baseUrl + 'api/events/' + evtId
    this.http.delete(request)
      .subscribe(result => {
        this.getEventsBySeriesToken()
      }, error => console.error(error))
  }

  getEventsBySeriesToken() {
    let request = this.baseUrl + 'api/events/byseries?token=' + this.seriesToken
    this.http.get<EventsResponse>(request)
      .subscribe(result => {
        console.log(result)
        this.events = result.data
      }, error => console.error(error))
  }

  copyLinkToClipboard() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.baseUrl + 'series/' + this.seriesToken
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
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
  eventDboId: string
  eventToken: string
  title: string
  location: string
  start: Date
  optimumDboId: number
  seriesToken: string
}

interface EventResponse {
  data: EventData
  links: { [key: string]: string; };
}

interface EventsResponse {
  data: EventResponse[]
  links: { [key: string]: string }
}
