// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component  } from '@angular/core'
import { Router } from '@angular/router'
import { DateAdapter } from '@angular/material/core'
import { EventViewComponentInput, EventViewComponentOutput } from './shared/event-view.component'
import { Guid } from './shared/guid.model'
import { EventData } from '../shared/models/events.model'
import { EventsService } from '../shared/services/events.service'

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
    private readonly router: Router,
    private dateAdapter: DateAdapter<Date>,
    private readonly eventsService: EventsService) {

    this.dateAdapter.setLocale('de')

    this.eventViewInput.title = null
    this.eventViewInput.buttonText = 'Erstellen'
    this.nextSeriesToken = Guid.newGuid()
  }

  ngOnInit() {
    this.eventsService.getInfo().subscribe(
      result => {
        console.info(result)
        this.postPermission = result.hrefs.hasOwnProperty('post')
      }, error => { console.error(error) })
  }

  onNotify(args: EventViewComponentOutput) {
    let newEvent = new EventData()
    newEvent.title = args.title
    newEvent.location = args.location
    newEvent.optimumId = args.optimumId
    newEvent.start = args.start

    this.eventsService.postEvent(newEvent).subscribe(
      result => {
        let selfRoute = result.hrefs['self']
        console.info(selfRoute)
        this.router.navigate([selfRoute])
      }, error => console.error(error))
  }
}
