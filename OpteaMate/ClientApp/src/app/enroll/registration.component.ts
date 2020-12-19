// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, Inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { RegistrationEditComponent } from './registration-edit/registration-edit.component'
import { EventEditComponent } from '../shared/components/event-edit.component'
import { IOptimum, Optimum } from '../shared/models/optima.model'
import { EventData, Event, IEvent, EventStats } from '../shared/models/events.model'
import { RegistrationData } from '../shared/models/registrations.model'
import { OptimaSerivce, OptimumResponse } from '../shared/services/optima.service'
import { EventResponse, EventsSerivce } from '../shared/services/events.service'

@Component({
  selector: 'app-registration-component',
  templateUrl: './registration.component.html',
})

export class RegistrationComponent {

  currentEvent: Event
  currentOptimum: Optimum

  newRegistration: RegistrationData = new RegistrationData()
  eventToken: string
  eventStartTime: Date
  eventUrl: string
  backRoute: string
  hasOverrepresentation: boolean
  hasMaximum: boolean
  lockedEvent: boolean

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private dialog: MatDialog,
    private readonly optimaService: OptimaSerivce,
    private readonly eventsService: EventsSerivce,
    @Inject('BASE_URL') private readonly baseUrl: string) {    
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventToken = params.eventtoken
      this.eventUrl = this.baseUrl + "enroll/" + this.eventToken
      this.getEventByEventToken()
    }, error => console.error(error))
  }

  copyLinkToClipboard() {
    const selBox = document.createElement('textarea')
    selBox.style.position = 'fixed'
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
    selBox.value = this.eventUrl
    document.body.appendChild(selBox)
    selBox.focus()
    selBox.select()
    document.execCommand('copy')
    document.body.removeChild(selBox)
  }

  addRegistration() {
    this.newRegistration.creationTime = new Date
    // because this.newRegistration is an UI object and cleared by the UI-Form-Element
    let regDto = new RegistrationData()
    regDto.creationTime = this.newRegistration.creationTime
    regDto.name = this.newRegistration.name
    regDto.offers = this.newRegistration.offers
    regDto.role = this.newRegistration.role
    this.eventsService.postEventRegistration(this.currentEvent.id, regDto).subscribe(
      result => {
        console.info(result)
        if (this.currentOptimum.roles.length == 1) {
          this.newRegistration.role = this.currentOptimum.roles[0]
        }
        this.updateEvent(result)
      }, error => console.error(error))
  }

  editRegistration(regId: number) {

    let reg = this.currentEvent.registrations.data.find(x => x.id == regId)
    if (reg != null && reg.id == regId) {

      const dialogConfig = new MatDialogConfig()
      dialogConfig.disableClose = false
      dialogConfig.autoFocus = true

      dialogConfig.data = {
        canDelete: reg.hrefs.hasOwnProperty('delete'),
        registrationName: reg.data.name,
        registrationOffers: reg.data.offers
      }

      const dialogRef = this.dialog.open(RegistrationEditComponent, dialogConfig)
      dialogRef.afterClosed().subscribe(
        data => {
          if (data != null && data.data != null) {
            console.info(data.data)
            if (data.data.deleteRegistration == true) {
              this.eventsService.deleteEventRegistration(this.currentEvent.id, regId).subscribe(result => {
                this.updateEvent(result)
              }, error => console.error(error))
            }
            else {
              reg.data.name = data.data.registrationName
              reg.data.offers = data.data.registrationOffers
              console.info(reg.data)
              this.eventsService.patchEventRegistration(this.currentEvent.id, regId, reg.data).subscribe(result => {
                this.updateEvent(result)
              }, error => console.error(error))
            }
          }
        }
      )
    }
  }

  editEvent(evtId: number) {

    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true

    dialogConfig.data = {
      eventId: evtId,
      eventTitle: this.currentEvent.data.title,
      eventLocation: this.currentEvent.data.location,
      eventStartTime: this.eventStartTime
    }
    console.info(dialogConfig.data)

    const dialogRef = this.dialog.open(EventEditComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(
      data => {
        if (data != null) {
          var evt = new EventData()
          evt.title = data.data.eventTitle
          evt.location = data.data.eventLocation
          evt.start = data.data.eventStartTime

          console.info(data.data.eventStartTime)
          console.info(data.data.eventTitle)
          console.info(data.data.eventLocation)

          console.info(evt)
          this.eventsService.patchEvent(evtId, evt).subscribe(
            result => {
              this.updateEvent(result)
            }, error => console.error(error))
        }
      }
    )
  }

  updateEvent(eventResponse: EventResponse) {

    this.currentEvent = new Event(eventResponse, new EventStats())
    this.backRoute = this.currentEvent.hrefs['back']
    this.lockedEvent = !this.currentEvent.hrefs.hasOwnProperty('patch')
    console.info(this.lockedEvent)

    // utc-to-local time
    let dt = new Date(eventResponse.data.start)
    let dtMs = dt.getTime() - dt.getTimezoneOffset() * 60000
    dt.setTime(dtMs)
    this.eventStartTime = dt

    this.optimaService.getOptimum(this.currentEvent.data.optimumId)
        .subscribe(result => {
          console.info(result)         
          this.updateOptimum(result)
          this.currentEvent.fillStats(this.currentOptimum)

        }, error => console.error(error))
  }

  getEventByEventToken() {
    this.eventsService.getEventByToken(this.eventToken).subscribe(
      result => {
        console.info(result)
        this.updateEvent(result)
      }, error => {
        console.error(error)
        // event expected
        this.router.navigate(['/404'])
     })   
  }

  updateOptimum(optimumResponse: OptimumResponse) {
    // TODO: Factory
    let opt = {
      id: optimumResponse.id,
      data: optimumResponse.data,
      roles: []
    }
    this.currentOptimum = new Optimum(opt)
    this.hasOverrepresentation = this.currentOptimum.data.overrepresentationMatrix != null
    this.hasMaximum = this.currentOptimum.data.maximum != null
    if (this.currentOptimum.roles.length == 1) {
      console.log(this.currentOptimum.roles[0])
      this.newRegistration.role = this.currentOptimum.roles[0]
    }
  }

  subStr(str: string, len: number) {
    if (str.length > len && str.length > 4) {
      return str.substr(0, len) + '...'
    }
    return str
  }

}
