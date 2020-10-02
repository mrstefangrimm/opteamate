// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, Inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-registration-component',
  templateUrl: './registration.component.html'
})

export class RegistrationComponent {
  currentEvent: EventResponse
  registrations: RegistrationData[]

  newRegistration: RegistrationData = new RegistrationData()
  eventToken: string = "N/A"
  eventId: string = "-1"
  eventStartTime: Date
  stats: StatisticData = new StatisticData
  positions: string[]
  selectedPosition: string
  eventUrl: string
  backRoute: string

  constructor(
    private route: ActivatedRoute,
    private readonly http: HttpClient,
    @Inject('BASE_URL') private readonly baseUrl: string) {

    this.route.params.subscribe(params => {
      this.eventToken = params.eventtoken
      this.eventUrl = this.baseUrl + "enroll/" + this.eventToken
      this.getEventByEventToken()
    })
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
    this.newRegistration.position = this.selectedPosition
    let request = this.baseUrl + 'api/events/' + this.eventId + "/registrations"
    this.http.post<RegistrationData>(request, this.newRegistration)
      .subscribe(result => {
        this.getEvent()
      }, error => console.error(error))
  }
    
  deleteRegistration(regId: string) {
    let request = this.baseUrl + 'api/events/' + this.eventId + "/registrations/" + regId
    this.http.delete(request)
      .subscribe(result => {
        this.getEvent()
      }, error => console.error(error))
  }

  getEvent() {
    let request = this.baseUrl + 'api/events/' + this.eventId
    this.http.get<EventResponse>(request)
      .subscribe(result => {
        console.log(result)
        this.currentEvent = result
        this.backRoute = this.currentEvent.links['back']

        let dt = new Date(result.data.start)
        let dtMs = dt.getTime() - dt.getTimezoneOffset() * 60000
        dt.setTime(dtMs)
        this.eventStartTime = dt

        if (result.registrations != null && result.registrations.data != null) {
          this.registrations = result.registrations.data
          this.stats.TotNumRegistrations = result.registrations.data.length
        }
        else {
          this.stats.TotNumRegistrations = 0
        }
        this.getPositions(this.currentEvent.data.optimumDboId)
      }, error => console.error(error))
  }

  getEventByEventToken() {
    let request = this.baseUrl + 'api/events/byevent?token=' + this.eventToken
    this.http.get<EventsResponse>(request)
      .subscribe(result => {
        console.log(result)

        result.data.forEach((item) => {
          console.log(item.data.eventToken)
          console.log(this.eventToken)
          if (item.data.eventToken === this.eventToken) {
            console.log(item.data.eventDboId)
            this.eventId = item.data.eventDboId
            console.log(this.eventId)
          }
        })
        this.getEvent()
        //this.copyLinkToClipboard();
        //alert("Die ULR ist bereits in der Zwischenablage.")
      }, error => console.error(error))
  }

  getPositions(optId: number) {
    let request = this.baseUrl + 'api/optima/' + optId
    this.http.get<OptimumResponse>(request)
      .subscribe(result => {
        console.log(result)
        let posStr = result.data.positions
        this.positions = posStr.split(';')
        this.fillStats(result)
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
        statData.registrations = this.registrations == null ? 0 : this.registrations.filter(item => item.position == pos).length
        if (optimaStrs[p] == '*') {
          statData.nextOptimum = statData.registrations + 1
          statData.missing = 0
          statData.remaining = 0
        }
        else {
          statData.nextOptimum = +optimaStrs[p]
          let diff = statData.nextOptimum - statData.registrations
          statData.missing = Math.max(0, diff)
          if ((diff < 0 && this.stats.prevOptima[pos] == 0) || (statData.missing == 0 && s == strategies.length - 1)) {
            statData.remaining = statData.registrations - statData.nextOptimum
          }
          else {
            statData.remaining = statData.registrations - this.stats.prevOptima[pos]
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

        this.positions.forEach(pos => {
          let statData = this.stats.theOptima[pos]
          if (statData.remaining > 0 && this.registrations != null) {
            let regForPos =  this.registrations.filter(item => item.position == pos)
            regForPos.sort((a, b) => +new Date(b.creationTime) - +new Date(a.creationTime))

            for (let n = 0; n < statData.remaining; n++) {
              regForPos[n].transientScratch = true
            }
          }

        })
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
}

class StatisticData {
  TotNumRegistrations: number
  theOptima: { [position: string]: OptimumStatData } = {}
  prevOptima: { [position: string]: number } = {}
}

interface OptimumData {
  optimaDboId: number
  name: string
  strategies: string
  positions: string
}

interface OptimumResponse {
  data: OptimumData
}

export class RegistrationData {
  registrationDboId: number
  name: string
  position: string
  sponsorOf: string
  creationTime: Date
  transientScratch: boolean
}

interface RegistrationsResponse {
  data: RegistrationData[]
  links: { [key: string]: string }
}

interface EventData {
  eventDboId: string
  eventToken: string
  title: string
  location: string
  start: Date
  optimumDboId: number
}

interface EventResponse {
  data: EventData
  links: { [key: string]: string }
  registrations: RegistrationsResponse
}

interface EventsResponse {
  data: EventResponse[]
  links: { [key: string]: string }
}
