// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, Inject  } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { DateAdapter } from '@angular/material/core'
import { Guid } from '../common/guid.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})

export class HomeComponent {

  eventsUri: string
  optimaUri: string

  newEvent: EventData = new EventData()
  optima: OptimumResponse[]

  postPermission: boolean
  selectedOptimum: OptimumResponse
  selectedDate: Date
  selectedHour: number
  selectedMinutes: number
  nextSeriesToken: string

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private dateAdapter: DateAdapter<Date>,
    @Inject('BASE_URL') private readonly baseUrl: string) {

    this.dateAdapter.setLocale('de');

    let tocRequest = this.baseUrl + 'api/toc'
    this.http.get<TocResponse>(tocRequest)
      .subscribe(result => {
        console.log(result)
        this.eventsUri = result.hrefs['events']
        this.optimaUri = result.hrefs['optima']
        console.log(this.eventsUri)
        console.log(this.optimaUri)

        this.http.get<OptimaResponse>(this.optimaUri)
          .subscribe(result => {
            console.log(result)
            this.optima = result.data
            this.selectedOptimum = this.optima[0]
            this.nextSeriesToken = Guid.newGuid()
          }, error => console.error(error))

        this.http.get<EventsInfoResponse>(this.eventsUri + 'info')
          .subscribe(result => {
            console.log(result)
            this.postPermission = result.permissions.includes('post')
          }, error => console.error(error))

        this.setInitialDateTime()

      }, error => console.error(error))    
  }

  addEvent() {
    this.newEvent.start = this.selectedDate
    this.newEvent.optimumId = this.selectedOptimum.id
    this.newEvent.start.setHours(this.selectedHour, this.selectedMinutes, 0, 0)

    this.http.post<EventResponse>(this.eventsUri, this.newEvent).
      subscribe(result => {
        console.info(result.data.eventToken)
        // set initial dt is not really required since we navigate away anyway
        this.setInitialDateTime()
        let selfRoute = result.hrefs['self']
        console.info(selfRoute)
        this.router.navigate([selfRoute])
      }, error => console.error(error))
  }

  isFutureDate() {
    if (this.selectedDate == null) return false
    
    var selected = this.selectedDate
    selected.setHours(this.selectedHour, this.selectedMinutes, 0, 0)

    let inFuture = +selected - +new Date() > 1 * 60 * 60 * 1000
    return inFuture
  }

  setInitialDateTime() {
    let currentDate = new Date();
    this.selectedHour = currentDate.getMinutes() > 30 ? currentDate.getHours() + 1 : currentDate.getHours();
    this.selectedMinutes = 0;
    this.selectedDate = currentDate
    this.selectedDate.setHours(currentDate.getHours() + 24, 0, 0, 0)
  }

}

interface OptimumData {
  name: string
  strategies: string
  positions: string
}

interface OptimumResponse {
  id: number
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
  optimumId: number
}

interface EventResponse {
  data: EventData
  hrefs: { [key: string]: string; };
}

interface EventsInfoResponse {
  permissions: [string]
}

interface TocResponse {
  hrefs: { [key: string]: string; };
}
