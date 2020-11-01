// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, Inject  } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { DateAdapter } from '@angular/material/core'

@Component({
  selector: 'app-home',
  templateUrl: './series.component.html',
})

export class SeriesComponent {

  eventsUri: string
  optimaUri: string

  events: EventResponse[]
  newEvent: EventData = new EventData()

  postPermission: boolean
  seriesToken: string
  selectedOptimum: OptimumResponse
  optima: OptimumResponse[]
  selectedHour: number
  selectedMinutes: number
  selectedDate: Date
  seriesUrl: string

  constructor(private route: ActivatedRoute,
    private readonly http: HttpClient,
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

        this.route.params.subscribe(params => {
          this.seriesToken = params.seriestoken
          this.seriesUrl = this.baseUrl + "series/" + this.seriesToken
          this.getEventsBySeriesToken()
        })

        this.http.get<OptimaResponse>(this.optimaUri)
          .subscribe(result => {
            console.log(result)
            this.optima = result.data
            this.selectedOptimum = this.optima[0]
          }, error => console.error(error))

        this.http.get<EventsInfoResponse>(this.eventsUri + 'info')
          .subscribe(result => {
            console.log(result)
            this.postPermission = result.permissions.includes('post')
          }, error => console.error(error))

        this.setInitialDateTime()

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
    this.newEvent.optimumId = this.selectedOptimum.id
    this.newEvent.seriesToken = this.seriesToken

    this.http.post<EventData>(this.eventsUri, this.newEvent).subscribe(result => {
      this.getEventsBySeriesToken()
      this.setInitialDateTime()
    }, error => console.error(error))
  }

  deleteEvent(evtId: string) {
    let request = this.eventsUri + evtId
    this.http.delete(request)
      .subscribe(result => {
        this.getEventsBySeriesToken()
      }, error => console.error(error))
  }

  getEventsBySeriesToken() {
    let request = this.eventsUri + 'byseries?token=' + this.seriesToken
    this.http.get<EventsResponse>(request)
      .subscribe(result => {
        console.log(result)
        if (result != null) {
          this.events = result.data

          this.events.forEach(
            e => {
              let infoRequest = this.eventsUri + e.id + '/registrations/info'
              this.http.get<RegistrationsInfoResponse>(infoRequest)
                .subscribe(result => {
                  console.log(result)
                  e.data.registrationsCount = result.data.numRegistrations
                  e.data.hasSponsors = result.data.hasSponsors
                }, error => console.error(error))
            })
        }
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

interface RegistrationsResponse {
  permissions: [string]
}

export class EventData {
  eventToken: string
  title: string
  location: string
  start: Date
  optimumId: number
  seriesToken: string

  registrationsCount: number
  hasSponsors: boolean
}

interface EventResponse {
  id: number
  data: EventData
  hrefs: { [key: string]: string; };
  registrations: RegistrationsResponse
  permissions: [string]
}

interface EventsResponse {
  data: EventResponse[]
  hrefs: { [key: string]: string }
  permissions: [string]
}

interface EventsInfoResponse {
  permissions: [string]
}

interface RegistrationsInfoData {
  numRegistrations: number
  hasSponsors: boolean
}

interface RegistrationsInfoResponse {
  data: RegistrationsInfoData
}

interface TocResponse {
  hrefs: { [key: string]: string; };
}
