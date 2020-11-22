// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, Inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { EventEditComponent } from '../nested-views/event-edit.component'
import { RegistrationEditComponent } from '../nested-views/registration-edit.component'

@Component({
  selector: 'app-registration-component',
  templateUrl: './registration.component.html',
})

export class RegistrationComponent {

  eventsUri: string
  optimaUri: string

  currentEvent: EventResponse
  registrations: RegistrationsResponse

  newRegistration: RegistrationData = new RegistrationData()
  eventToken: string
  eventId: number
  eventStartTime: Date
  stats: StatisticData = new StatisticData
  positions: string[]
  eventUrl: string
  backRoute: string
  hasOverrepresentation: boolean
  hasMaximum: boolean
  lockedEvent: boolean

  constructor(
    private route: ActivatedRoute,
    private readonly http: HttpClient,
    private readonly router: Router,
    private dialog: MatDialog,
    @Inject('BASE_URL') private readonly baseUrl: string) {

    let tocRequest = this.baseUrl + 'api/toc'
    this.http.get<TocResponse>(tocRequest)
      .subscribe(result => {
        console.log(result)
        this.eventsUri = result.hrefs['events']
        this.optimaUri = result.hrefs['optima']
        console.log(this.eventsUri)
        console.log(this.optimaUri)

        this.route.params.subscribe(params => {
          this.eventToken = params.eventtoken
          this.eventUrl = this.baseUrl + "enroll/" + this.eventToken
          this.getEventByEventToken()
        })

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
    let request = this.eventsUri + this.eventId + "/registrations"
    this.http.post<RegistrationData>(request, this.newRegistration)
      .subscribe(result => {
        if (this.positions.length == 1) {
          this.newRegistration.position = this.positions[0]
        }
        this.getEvent()
      }, error => console.error(error))
  }

  editRegistration(regId: number) {

    let reg = this.registrations.data.find(x => x.id == regId)
    if (reg != null && reg.id == regId) {

      const dialogConfig = new MatDialogConfig()
      dialogConfig.disableClose = false
      dialogConfig.autoFocus = true

      dialogConfig.data = {
        canDelete: true,
        registrationName: reg.data.name,
        registrationOffers: reg.data.offers
      }

      const dialogRef = this.dialog.open(RegistrationEditComponent, dialogConfig)
      dialogRef.afterClosed().subscribe(
        data => {
          if (data != null && data.data != null) {
            console.info(data.data)
            if (data.data.deleteRegistration == true) {
              let request = this.eventsUri + this.eventId + "/registrations/" + regId
              this.http.delete(request)
                .subscribe(result => {
                  this.getEvent()
                }, error => console.error(error))
            }
            else {
              reg.data.name = data.data.registrationName
              reg.data.offers = data.data.registrationOffers
              console.info(reg.data)

              let request = this.eventsUri + this.eventId + "/registrations/" + regId
              this.http.patch<RegistrationData>(request, reg.data)
                .subscribe(result => {
                  this.getEvent()
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

    console.info(this.eventStartTime)
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
          let request = this.eventsUri + evtId
          this.http.patch<EventData>(request, evt)
            .subscribe(result => {
              this.getEvent()
            }, error => console.error(error))
        }
      }
    )
  }

  getEvent() {
    let request = this.eventsUri + this.eventId
    this.http.get<EventResponse>(request)
      .subscribe(result => {
        console.log(result)
        this.currentEvent = result
        this.backRoute = this.currentEvent.hrefs['back']
        this.lockedEvent = !this.currentEvent.hrefs.hasOwnProperty('patch')
        console.info(this.lockedEvent)

        // utc-to-local time
        let dt = new Date(result.data.start)
        let dtMs = dt.getTime() - dt.getTimezoneOffset() * 60000
        dt.setTime(dtMs)
        this.eventStartTime = dt

        this.registrations = result.registrations
        this.stats.TotNumRegistrations = result.registrations.data.length

        this.getPositions(this.currentEvent.data.optimumId)
      }, error => console.error(error))
  }

  getEventByEventToken() {
    let request = this.eventsUri + 'byevent?token=' + this.eventToken
    this.http.get<EventsResponse>(request)
      .subscribe(result => {
        console.log(result)

        result.data.forEach((item) => {
          console.log(item.data.eventToken)
          console.log(this.eventToken)
          if (item.data.eventToken === this.eventToken) {
            console.log(item.id)
            this.eventId = item.id
            console.log(this.eventId)
          }
        })
        if (this.eventId != null) {
          this.getEvent()
        }
        else {
          // event expected
          this.router.navigate(['/404'])
        }
        //this.copyLinkToClipboard();
        //alert("Die ULR ist bereits in der Zwischenablage.")
      }, error => {
        console.error(error)
        this.router.navigate(['/404'])
      })
  }

  getPositions(optId: number) {
    let request = this.optimaUri + optId
    this.http.get<OptimumResponse>(request)
      .subscribe(result => {
        console.log(result)
        this.hasOverrepresentation = result.data.overrepresentationMatrix != null
        this.hasMaximum = result.data.maximum != null
        let posStr = result.data.positions
        this.positions = posStr.split(';')
        this.fillStats(result)
        if (this.positions.length == 1) {
          console.log(this.positions[0])
          this.newRegistration.position = this.positions[0]
        }
      }, error => console.error(error))
  }

  fillStats(result: OptimumResponse) {

    let stratStr = result.data.strategies
    let strategies = stratStr.split(';')

    this.positions.forEach(pos => {
      this.stats.prevOptima[pos] = 0
    })
        
    for (let s = 0; s < strategies.length; s++) {
      let optimaStrs = strategies[s].split('-')
      
      for (let p = 0; p < this.positions.length; p++) {
        let pos = this.positions[p]
        let statData = new OptimumStatData
        statData.registrations = this.registrations == null ? 0 : this.registrations.data.filter(item => item.data.position == pos).length
        if (optimaStrs[p] == '*') {
          statData.nextOptimum = statData.registrations + 1
          statData.missing = 0
          statData.remaining = 0
        }
        else {
          statData.nextOptimum = +optimaStrs[p]
          let diff = statData.nextOptimum - statData.registrations
          let hasNextOptimum = diff > 0
          if ((diff < 0 && this.stats.prevOptima[pos] == 0) || (!hasNextOptimum && s == strategies.length - 1)) {
            statData.remaining = statData.registrations - statData.nextOptimum
          }
          else {
            statData.remaining = statData.registrations - this.stats.prevOptima[pos]
          }
          if (this.stats.prevOptima[pos] == 0) {
            statData.missing = Math.max(0, diff)
          }
          else {
            statData.missing = 0
          }
        }
        this.stats.theOptima[pos] = statData
      }

      let continueCondition = (s != strategies.length - 1)
      this.positions.forEach(pos => {
        let statData = this.stats.theOptima[pos]
        let diff = statData.nextOptimum - statData.registrations
        if (diff > 0) {
          continueCondition = false
        }
        this.stats.prevOptima[pos] = statData.nextOptimum
      })

      if (!continueCondition) {

        // Check for overrepresentation
        if (result.data.overrepresentationMatrix) {
          let overrepStr = result.data.overrepresentationMatrix
          let overrepRows = overrepStr.split(';')

          var overrepMat: Array<Float32Array> = new Array<Float32Array>();
          for (let n = 0; n < this.positions.length; n++) {
            let overrepCols = overrepRows[n].split(',')
            let fa = new Float32Array(3)
            for (let m = 0; m < this.positions.length; m++) {
              fa[m] = +overrepCols[m];
            }
            overrepMat.push(fa)
          }
          console.log(overrepMat)

          var overrepVec: Float32Array = new Float32Array(this.positions.length)
          for (let n = 0; n < this.positions.length; n++) {
            overrepVec[n] = 0
            for (let m = 0; m < this.positions.length; m++) {
              let statData = this.stats.theOptima[this.positions[m]]
              overrepVec[n] += statData.registrations * overrepMat[n][m]
            }
          }
          console.log(overrepVec)
          for (let n = 0; n < this.positions.length; n++) {
            let statData = this.stats.theOptima[this.positions[n]]
            if (overrepVec[n] > 0) {
              // Correction
              if (optimaStrs[n] == '*') {
                statData.nextOptimum -= 1
              }
              statData.remaining = statData.overrepresentation = Math.ceil(overrepVec[n])
            }
            else {
              statData.overrepresentation = 0
            }
          }
        }

        // Check for max. number of participants
        if (result.data.maximum) {
          let maximumStr = result.data.maximum
          console.log(maximumStr)
          let maximumPerPos = maximumStr.split('-')
          for (let n = 0; n < this.positions.length; n++) {
            let statData = this.stats.theOptima[this.positions[n]]
            statData.maximum = +maximumPerPos[n]
            // Correction
            statData.nextOptimum = Math.min(statData.nextOptimum, statData.maximum)
            // Check maximum if remaining is 0, i.e. the other rules did not apply
            if (statData.remaining == 0 && statData.registrations - statData.maximum > 0) {
              statData.remaining = statData.registrations - statData.maximum
            }
          }
        }

        // Check for a minimal number of registrations
        var someMissing = false
        this.positions.forEach(pos => {
          let statData = this.stats.theOptima[pos]
          if (statData.missing > 0) {
            someMissing = true
          }
        })
        console.info(someMissing)
        if (someMissing && this.registrations != null) {
          this.registrations.data.forEach(reg => reg.data.transientScratch = true)
        }
        else {
          // Set scratch based on creation time
          this.positions.forEach(pos => {
            let statData = this.stats.theOptima[pos]
            if (statData.remaining > 0 && this.registrations != null) {
              let regForPos = this.registrations.data.filter(item => item.data.position == pos)
              regForPos.sort((a, b) => +new Date(b.data.creationTime) - +new Date(a.data.creationTime))

              for (let n = 0; n < statData.remaining; n++) {
                regForPos[n].data.transientScratch = true
              }
            }

          })
        }
        return
      }
    }
  }
}

class OptimumStatData {
  nextOptimum: number
  registrations: number
  missing: number
  remaining: number
  overrepresentation: number
  maximum: number
}

class StatisticData {
  TotNumRegistrations: number
  theOptima: { [position: string]: OptimumStatData } = {}
  prevOptima: { [position: string]: number } = {}
}

interface OptimumData {
  name: string
  strategies: string
  positions: string
  overrepresentationMatrix: string
  maximum: string
}

interface OptimumResponse {
  data: OptimumData
}

export class RegistrationData {
  name: string
  position: string
  offers: string
  creationTime: Date
  transientScratch: boolean
}

export interface RegistrationResponse {
  id: number
  data: RegistrationData
  hrefs: { [key: string]: string }
}

interface RegistrationsResponse {
  data: RegistrationResponse[]
  hrefs: { [key: string]: string }
}

export class EventData {
  eventToken: string
  title: string
  location: string
  start: Date
  optimumId: number
}

interface EventResponse {
  id: number
  data: EventData
  hrefs: { [key: string]: string }
  registrations: RegistrationsResponse
}

interface EventsResponse {
  data: EventResponse[]
  hrefs: { [key: string]: string }
}

interface TocResponse {
  hrefs: { [key: string]: string; };
}
