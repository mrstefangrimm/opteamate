// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, Inject  } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { DateAdapter } from '@angular/material/core'
import { EventViewComponentInput, EventViewComponentOutput } from '../nested-views/event-view.component';
import { Guid } from '../common/guid.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})

export class HomeComponent {

  eventsUri: string

  postPermission: boolean
  eventViewInput: EventViewComponentInput = new EventViewComponentInput()
  nextSeriesToken: string

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private dateAdapter: DateAdapter<Date>,
    @Inject('BASE_URL') private readonly baseUrl: string) {

    this.dateAdapter.setLocale('de')

    this.eventViewInput.title = null
    this.eventViewInput.buttonText = 'Erstellen'
    this.nextSeriesToken = Guid.newGuid()
  }

  ngOnInit() {
    let tocRequest = this.baseUrl + 'api/toc'
    this.http.get<TocResponse>(tocRequest)
      .subscribe(result => {
        console.log(result)
        this.eventsUri = result.hrefs['events']
        console.log(this.eventsUri)

        this.http.get<EventsInfoResponse>(this.eventsUri + 'info')
          .subscribe(result => {
            console.log(result)
            this.postPermission = result.hrefs.hasOwnProperty('post')
          }, error => console.error(error))

      }, error => console.error(error))
  }

  onNotify(args: EventViewComponentOutput) {
    var newEvent = new EventData()
    newEvent.title = args.title
    newEvent.location = args.location
    newEvent.optimumId = args.optimumId
    newEvent.start = args.start

    this.http.post<EventResponse>(this.eventsUri, newEvent).
      subscribe(result => {
        let selfRoute = result.hrefs['self']
        console.info(selfRoute)
        this.router.navigate([selfRoute])
      }, error => console.error(error))
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
  hrefs: { [key: string]: string; };
}

interface TocResponse {
  hrefs: { [key: string]: string; };
}
