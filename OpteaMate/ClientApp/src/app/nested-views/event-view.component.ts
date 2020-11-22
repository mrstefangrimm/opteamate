// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'event-view',
  templateUrl: './event-view.component.html'
})

export class EventViewComponent implements OnInit {

  @Input() config: EventViewComponentInput
  @Output() notify: EventEmitter<EventViewComponentOutput> = new EventEmitter<EventViewComponentOutput>();

  optimaUri: string
  optima: OptimumResponse[]
  newEventTitle: string
  newEventLocation: string

  selectedOptimum: OptimumResponse
  selectedDate: Date
  selectedHour: number
  selectedMinutes: number
  nextSeriesToken: string

  constructor(
    private readonly http: HttpClient,
    private dateAdapter: DateAdapter<Date>,
    @Inject('BASE_URL') private readonly baseUrl: string) {
  }

  ngOnInit() {
    this.dateAdapter.setLocale('de')

    let tocRequest = this.baseUrl + 'api/toc'
    this.http.get<TocResponse>(tocRequest)
      .subscribe(result => {
        console.log(result)
        this.optimaUri = result.hrefs['optima']
        console.log(this.optimaUri)

        this.http.get<OptimaResponse>(this.optimaUri)
          .subscribe(result => {
            console.log(result)
            this.optima = result.data
            this.selectedOptimum = this.optima[0]
          }, error => console.error(error))

        this.setInitialDateTime()

      }, error => console.error(error))
  }

  addEvent() {
    var start = this.selectedDate
    start.setHours(this.selectedHour, this.selectedMinutes, 0, 0)

    let evtArgs = Object.assign(new EventViewComponentOutput(), {
      title: this.newEventTitle,
      location: this.newEventLocation,
      start: start,
      optimumId: this.selectedOptimum.id,
    });

    this.notify.emit(evtArgs)

    // Workaround so that after the button type="reset" the selectedDate is correctly set
    setTimeout(() => this.setInitialDateTime())
  }

  setInitialDateTime() {
    let currentDate = new Date()
    this.selectedHour = currentDate.getMinutes() > 30 ? currentDate.getHours() + 1 : currentDate.getHours()
    this.selectedMinutes = 0
    this.selectedDate = currentDate
    this.selectedDate.setHours(currentDate.getHours() + 24, 0, 0, 0)
  }

  isFutureDate() {
    if (this.selectedDate == null) return false

    var selected = this.selectedDate
    selected.setHours(this.selectedHour, this.selectedMinutes, 0, 0)

    let inFuture = +selected - +new Date() > 1 * 60 * 60 * 1000
    return inFuture
  }
}

export class EventViewComponentInput {
  title: string
  buttonText: string
}

export class EventViewComponentOutput {
  title: string
  location: string
  start: Date
  optimumId: number
}

interface TocResponse {
  hrefs: { [key: string]: string; };
}

interface OptimumData {
  name: string
  strategies: string
  positions: string
  overrepresentationMatrix: string
  maximum: string
}

interface OptimumResponse {
  id: number
  data: OptimumData
}

interface OptimaResponse {
  data: OptimumResponse[]
}

