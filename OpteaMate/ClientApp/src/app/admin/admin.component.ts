// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-component',
  templateUrl: './admin.component.html'
})

export class AdminComponent {
  found: boolean = false
  eventData: Event

  constructor(private route: ActivatedRoute,
    private readonly http: HttpClient,
    @Inject('BASE_URL') private readonly baseUrl: string) {
  }

  getEvent(token: string) {
    this.found = false
    this.http.get<EventResponse>(this.baseUrl + 'api/events/' + token).subscribe(result => {
      this.found = true
      this.eventData = result.data
    }, error => console.error(error));
  }

}

export class Event {
  title: string
  location: string
  start: string
  duration: string
  optimaId: string
}

interface EventResponse {
  data: Event
  links: { [key: string]: string; };
}
