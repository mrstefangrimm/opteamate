// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, Inject  } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { DateAdapter } from '@angular/material/core'
import { MatDialogConfig, MatDialog } from '@angular/material/dialog'
import { EventEditComponent } from '../nested-views/event-edit.component'
import { EventViewComponentInput, EventViewComponentOutput } from '../nested-views/event-view.component'

@Component({
  selector: 'app-home',
  templateUrl: './series.component.html',
})

export class SeriesComponent {

  eventsUri: string
  optimaUri: string
  seriesToken: string

  events: EventResponse[]

  postPermission: boolean
  eventViewInput: EventViewComponentInput = new EventViewComponentInput()


  constructor(private route: ActivatedRoute,
    private readonly http: HttpClient,
    private dateAdapter: DateAdapter<Date>,
    private dialog: MatDialog,
    @Inject('BASE_URL') private readonly baseUrl: string) {

    this.dateAdapter.setLocale('de');

    this.eventViewInput.title = 'Anlass Hinzufügen'
    this.eventViewInput.buttonText = 'Hinzufügen'

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
          this.getEventsBySeriesToken()
        })      

        this.http.get<EventsInfoResponse>(this.eventsUri + 'info')
          .subscribe(result => {
            console.log(result)
            this.postPermission = result.hrefs.hasOwnProperty('post')
          }, error => console.error(error))

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

  editEvent(evtId: number) {

    this.events.forEach(evt => {
      if (evt.id == evtId) {
        const dialogConfig = new MatDialogConfig()
        dialogConfig.disableClose = false
        dialogConfig.autoFocus = true

        // utc-to-local time
        let dt = new Date(evt.data.start)
        let dtMs = dt.getTime() - dt.getTimezoneOffset() * 60000
        dt.setTime(dtMs)
        dialogConfig.data = {
          eventId: evtId,
          eventTitle: evt.data.title,
          eventLocation: evt.data.location,
          eventStartTime: dt,
          canDelete: evt.hrefs.hasOwnProperty('delete')
        }

        console.info(evt.data.start)
        const dialogRef = this.dialog.open(EventEditComponent, dialogConfig)
        dialogRef.afterClosed().subscribe(
          data => {
            if (data != null && data.data != null) {
              console.info(data.data)
              if (data.data.deleteEvent == true) {
                let request = this.eventsUri + evtId                
                this.http.delete(request)
                  .subscribe(result => {
                    this.getEventsBySeriesToken()
                  }, error => console.error(error))
              }
              else {
                var evt = new EventData()
                evt.title = data.data.eventTitle
                evt.location = data.data.eventLocation
                evt.start = data.data.eventStartTime

                console.info(data.data.eventStartTime)
                console.info(data.data.eventTitle)
                console.info(data.data.eventLocation)

                console.info(evt)
                let request = this.eventsUri + evtId
                this.http.patch<EventData>(request, evt)
                  .subscribe(result => {
                    this.getEventsBySeriesToken()
                  }, error => console.error(error))
              }
            }
          }
        )
      }
    })
  }

  onNotify(args: EventViewComponentOutput) {
    var newEvent = new EventData()
    newEvent.title = args.title
    newEvent.location = args.location
    newEvent.optimumId = args.optimumId
    newEvent.start = args.start
    newEvent.seriesToken = this.seriesToken

    this.http.post<EventResponse>(this.eventsUri, newEvent).
      subscribe(result => {
        this.getEventsBySeriesToken()
      }, error => console.error(error))
  }

  getEventsBySeriesToken() {
    let request = this.eventsUri + 'byseries?token=' + this.seriesToken
    this.http.get<EventsResponse>(request)
      .subscribe(result => {
        console.log(result)
        this.events = result.data
        if (this.events != null) {
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

}

interface RegistrationsResponse {
  hrefs: { [key: string]: string; };
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
  registrations: RegistrationsResponse
  hrefs: { [key: string]: string; };
}

interface EventsResponse {
  data: EventResponse[]
  hrefs: { [key: string]: string }
}

interface EventsInfoResponse {
  hrefs: { [key: string]: string; };
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
