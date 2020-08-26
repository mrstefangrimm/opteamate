// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, Inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent {

  newEvent: EventData = new EventData()
  selectedOptimum: OptimumResponse
  optima: OptimumResponse[]
  selectedHour: number = 19;
  selectedMinutes: number = 0;
  selectedDate = new FormControl(new Date());

  show: boolean = false
  httpRepose: string = 'Empty'

  constructor(private route: ActivatedRoute,
    private readonly http: HttpClient,
    @Inject('BASE_URL') private readonly baseUrl: string) {

    this.http.get<OptimaResponse>(
      this.baseUrl + 'api/optima/')
      .subscribe(result => {
        console.log(result)
        this.optima = result.data
        this.selectedOptimum = this.optima[1]
      },
        error => console.error(error))
  }

  addEvent() {

    this.newEvent.start = <Date>this.selectedDate.value
    this.newEvent.optimumDboId = this.selectedOptimum.data.optimumDboId
    this.newEvent.start.setHours(this.selectedHour, this.selectedMinutes, 0, 0)
    this.httpRepose = this.newEvent.start.toString()

    this.http.post<EventResponse>(this.baseUrl + 'api/events', this.newEvent).subscribe(result => {
      this.show = true
      this.httpRepose = result.links['other'] + ', ' + result.data.title + ', ' + result.data.location
      window.location.href = result.links['other']
    }, error => console.error(error))
  }

  //onOptimaChanged(event: Event) {
  //  // when I use [(ngModel)]="selectedValue", the event.target value is something like "1: Object"
  //  // without this, the traget value is the selected value
  //  let selectedId = parseInt((<HTMLInputElement>event.target).value.split(':')[0])
  //  this.selectedOptima = this.optimas[selectedId].data
  //  this.newEvent.optimaId = this.selectedOptima.optimaDboId
  //}

  ////https://stackoverflow.com/questions/46962322/angular-material-datepicker-get-value-on-change
  //onDatePickerChanged(type: string, event: MatDatepickerInputEvent<Date>) {
  //  //this.events.push(`${type}: ${event.value}`);
  //  this.httpRepose = event.value.getDay().toString()
  //}

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
  title: string
  location: string
  start: Date
  optimumDboId: number
}

interface EventResponse {
  data: EventData
  links: { [key: string]: string; };
}
