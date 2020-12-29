// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, Inject  } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { DateAdapter } from '@angular/material/core'
import { MatDialogConfig, MatDialog } from '@angular/material/dialog'
import { EventViewComponentInput, EventViewComponentOutput } from './shared/event-view.component'
import { EventEditComponent } from '../shared/components/event-edit.component'
import { EventData, IEvent } from '../shared/models/events.model'
import { IRegistrations, IRegistrationsInfo } from '../shared/models/registrations.model'
import { EventResponse, EventsService } from '../shared/services/events.service'

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
})

export class SeriesComponent {

  seriesToken: string

  events: SeriesEvent[]

  postPermission: boolean
  eventViewInput: EventViewComponentInput = new EventViewComponentInput()

  constructor(
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<Date>,
    private dialog: MatDialog,
    private readonly eventsService: EventsService,
    @Inject('BASE_URL') private readonly baseUrl: string) {

    this.dateAdapter.setLocale('de');

    this.eventViewInput.title = 'Anlass Hinzufügen'
    this.eventViewInput.buttonText = 'Hinzufügen'   
  }

  ngOnInit() {
    this.eventsService.getInfo().subscribe(
      result => {
        console.info(result)
        this.postPermission = result.hrefs.hasOwnProperty('post')
      }, error => { console.error(error) })

    this.route.params.subscribe(params => {
      this.seriesToken = params.seriestoken
      this.eventViewInput.seriesToken = params.seriestoken
      this.getEventsBySeriesToken()
    })
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

                this.eventsService.deleteEvent(evtId).subscribe(
                  result => {
                    console.info(result)
                    // result is of type 'NoContent' - reload is required.
                    this.getEventsBySeriesToken()
                  }, error => console.error(error))
              }
              else {
                let evt = new EventData()
                evt.title = data.data.eventTitle
                evt.location = data.data.eventLocation
                evt.start = data.data.eventStartTime

                console.info(data.data.eventStartTime)
                console.info(data.data.eventTitle)
                console.info(data.data.eventLocation)
                console.info(evt)

                this.eventsService.patchEvent(evtId, evt).subscribe(
                  result => {
                    this.updateEventData(result)
                  }, error => console.error(error))
              }
            }
          }
        )
      }
    })
  }

  onNotify(args: EventViewComponentOutput) {
    let newEvent = new EventData()
    newEvent.title = args.title
    newEvent.location = args.location
    newEvent.optimumId = args.optimumId
    newEvent.start = args.start
    newEvent.seriesToken = this.seriesToken

    this.eventsService.postEvent(newEvent).subscribe(
      result => {
        // other events can be added in the meanwhile - reload is required.
        this.getEventsBySeriesToken()
      }, error => console.error(error))
  }

  updateEvents(events: EventResponse[]) {
    if (events != null) {
      this.events = events.map(x => new SeriesEvent(x, new SeriesEventStats()))
      if (this.events != null) {
        this.events.forEach(
          e => {
            this.eventsService.getRegistrationsInfo(e.id).subscribe(
              result => {
                console.info(result)
                e.fillStats(result)
              }, error => console.error(error))
          })
      }
    }
    else {
      this.events = SeriesEvent[0]
    }   
  }

  updateEventData(other: EventResponse) {
    if (this.events != null) {
      let evt = this.events.find(x => x.id == other.id)
      if (evt != null) {
        evt.data = other.data
      }
      else {
        console.error('update event but not found.')
      }
    }
    else {
      console.error('update event on null.')
    }
  }

  getEventsBySeriesToken() {
    this.eventsService.getEventSeries(this.seriesToken).subscribe(
      result => {
        console.info(result)
        this.updateEvents(result.data)
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

class SeriesEventStats {
  registrationsCount: number
  hasSponsors: boolean
}

class SeriesEvent implements IEvent {

  id: number
  data: EventData
  hrefs: { [key: string]: string }
  registrations: IRegistrations

  constructor(other: IEvent, readonly stats: SeriesEventStats) {
    if (other == null) throw new Error('other')
    if (stats == null) throw new Error('stats')

    this.id = other.id
    this.data = other.data
    this.hrefs = other.hrefs
    this.registrations = other.registrations
  }

  fillStats(info: IRegistrationsInfo) {
    this.stats.registrationsCount = info.data.numRegistrations
    this.stats.hasSponsors = info.data.hasSponsors
  }
}
