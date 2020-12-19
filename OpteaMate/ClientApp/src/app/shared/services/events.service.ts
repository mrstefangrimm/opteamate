// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { TocService } from './toc.service'
import { EventData, IEvent } from '../models/events.model'
import { IRegistration, RegistrationData, IRegistrations, IRegistrationsInfo } from '../models/registrations.model'

@Injectable({
  providedIn: 'root'
})

export class EventsSerivce {

  private eventsHref: string

  constructor(
    private readonly http: HttpClient,
    private readonly tocService: TocService) {
  }

  getInfo() {

    let getInfoFromHref = subscriber => {
      let request = this.eventsHref + 'info'
      console.info(request)
      this.http.get<EventsInfoResponse>(request).subscribe(
        result => {
          subscriber.next(result)
        },
        error => {
          console.error(error)
          subscriber.error()
        })
    }

    return new Observable<EventsInfoResponse>(subscriber => {
      if (this.eventsHref === undefined) {
        this.updateEventsHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              getInfoFromHref(subscriber)
            }
            else {
              console.error('HREF for events is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })        
      }
      else {
        getInfoFromHref(subscriber)
      }
    })
  }

  postEvent(data: EventData) {

    let postEventFromHref = (data, subscriber) => {
      let request = this.eventsHref
      console.info(request)
      this.http.post<EventResponse>(request, data).
        subscribe(
          result => {
            subscriber.next(result)
          },
          error => {
            console.error(error)
            subscriber.error()
          })
    }

    return new Observable<EventResponse>(subscriber => {
      if (this.eventsHref === undefined) {
        this.updateEventsHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              postEventFromHref(data, subscriber)
            }
            else {
              console.error('HREF for events is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })
      }
      else {
        postEventFromHref(data, subscriber)
      }
    })
  }

  patchEvent(id: number, data: EventData) {

    let patchEventFromHref = (id, data, subscriber) => {
      let request = this.eventsHref + id
      console.info(request)
      this.http.patch<EventResponse>(request, data).
        subscribe(
          result => {
            subscriber.next(result)
          },
          error => {
            console.error(error)
            subscriber.error()
          })
    }

    return new Observable<EventResponse>(subscriber => {
      if (this.eventsHref === undefined) {
        this.updateEventsHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              patchEventFromHref(id, data, subscriber)
            }
            else {
              console.error('HREF for events is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })
      }
      else {
        patchEventFromHref(id, data, subscriber)
      }
    })
  }

  getEventByToken(token: string) {

    let getEventFromHref = (token, subscriber) => {
      let request = this.eventsHref + 'byevent?token=' + token
      console.info(request)
      this.http.get<EventsResponse>(request)
        .subscribe(result => {
          let idFound: number = null
          result.data.forEach(item => {
            console.log(item.data.eventToken)
            console.log(token)
            if (item.data.eventToken === token) {
              console.log(item.id)
              idFound = item.id
            }
          })
          if (idFound != null) {
            this.getEventById(idFound).subscribe(
              result => {
                subscriber.next(result)
              }, error => {
                console.error(error)
                subscriber.error()
              })
          }
          else {
            console.error('event with token not found: ' + token)
            subscriber.error()
          }
        }, error => {
          console.error(error)
          subscriber.error()
        })
    }

    return new Observable<EventResponse>(subscriber => {
      if (this.eventsHref === undefined) {
        this.updateEventsHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              getEventFromHref(token, subscriber)
            }
            else {
              console.error('HREF for events is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })
      }
      else {
        getEventFromHref(token, subscriber)
      }
    })
  }

  getEventById(id: number) {

    let getEventFromHref = (id, subscriber) => {
      let request = this.eventsHref + id
      console.info(request)
      this.http.get<EventResponse>(request)
        .subscribe(result => {
          subscriber.next(result)
        }, error => {
          console.error(error)
          subscriber.error()
        })
    }

    return new Observable<EventResponse>(subscriber => {
      if (this.eventsHref === undefined) {
        this.updateEventsHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              getEventFromHref(id, subscriber)
            }
            else {
              console.error('HREF for events is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })
      }
      else {
        getEventFromHref(id, subscriber)
      }
    })
  }

  getEventSeries(token: string) {

    let getSeriesFromHref = (token, subscriber) => {
      let request = this.eventsHref + 'byseries?token=' + token
      console.info(request)
      this.http.get<EventsResponse>(request)
        .subscribe(result => {
          subscriber.next(result)
        }, error => {
          console.error(error)
          subscriber.error()
        })
    }

    return new Observable<EventsResponse>(subscriber => {
      if (this.eventsHref === undefined) {
        this.updateEventsHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              getSeriesFromHref(token, subscriber)
            }
            else {
              console.error('HREF for events is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })
      }
      else {
        getSeriesFromHref(token, subscriber)
      }
    })
  }

  deleteEvent(id: number) {

    let deleteEventFromHref = (id, subscriber) => {
      let request = this.eventsHref + id
      console.info(request)
      this.http.delete(request).subscribe(
          result => {
            subscriber.next(result)
          },
          error => {
            console.error(error)
            subscriber.error()
          })
    }

    return new Observable<object>(subscriber => {
      if (this.eventsHref === undefined) {
        this.updateEventsHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              deleteEventFromHref(id, subscriber)
            }
            else {
              console.error('HREF for events is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })
      }
      else {
        deleteEventFromHref(id, subscriber)
      }
    })
  }

  getRegistrationsInfo(eventId: number) {

    let getRegistrationInfoFromHref = (eventId, subscriber) => {
      let request = this.eventsHref + eventId + '/registrations/info'
      console.info(request)
      this.http.get<RegistrationsInfoResponse>(request).
        subscribe(
          result => {
            subscriber.next(result)
          },
          error => {
            console.error(error)
            subscriber.error()
          })
    }

    return new Observable<RegistrationsInfoResponse>(subscriber => {
      if (this.eventsHref === undefined) {
        this.updateEventsHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              getRegistrationInfoFromHref(eventId, subscriber)
            }
            else {
              console.error('HREF for events is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })
      }
      else {
        getRegistrationInfoFromHref(eventId, subscriber)
      }
    })
  }

  postEventRegistration(eventId: number, data: RegistrationData) {

    let postRegistrationFromHref = (eventId, data, subscriber) => {
      let request = this.eventsHref + eventId + "/registrations"
      console.info(request)
      this.http.post<EventResponse>(request, data).
        subscribe(
          result => {
            subscriber.next(result)
          },
          error => {
            console.error(error)
            subscriber.error()
          })
    }

    return new Observable<EventResponse>(subscriber => {
      if (this.eventsHref === undefined) {
        this.updateEventsHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              postRegistrationFromHref(eventId, data, subscriber)
            }
            else {
              console.error('HREF for events is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })
      }
      else {
        postRegistrationFromHref(eventId, data, subscriber)
      }
    })
  }

  patchEventRegistration(eventId: number, registrationId: number, data: RegistrationData) {

    let patchRegistrationFromHref = (eventId, registrationId, subscriber) => {
      let request = this.eventsHref + eventId + "/registrations/" + registrationId
      console.info(request)
      this.http.patch<EventResponse>(request, data).
        subscribe(
          result => {
            subscriber.next(result)
          },
          error => {
            console.error(error)
            subscriber.error()
          })
    }

    return new Observable<EventResponse>(subscriber => {
      if (this.eventsHref === undefined) {
        this.updateEventsHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              patchRegistrationFromHref(eventId, registrationId, subscriber)
            }
            else {
              console.error('HREF for events is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })
      }
      else {
        patchRegistrationFromHref(eventId, registrationId, subscriber)
      }
    })
  }

  deleteEventRegistration(eventId: number, registrationId: number) {

    let deleteRegistrationFromHref = (eventId, subscriber) => {
      let request = this.eventsHref + eventId + "/registrations/" + registrationId
      console.info(request)
      this.http.delete<EventResponse>(request).
        subscribe(
          result => {
            subscriber.next(result)
          },
          error => {
            console.error(error)
            subscriber.error()
          })
    }

    return new Observable<EventResponse>(subscriber => {
      if (this.eventsHref === undefined) {
        this.updateEventsHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              deleteRegistrationFromHref(eventId, subscriber)
            }
            else {
              console.error('HREF for events is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })
      }
      else {
        deleteRegistrationFromHref(eventId, subscriber)
      }
    })
  }

  private updateEventsHrefFromToc(): Observable<string> {
    return new Observable<string>(subscriber => {
      this.tocService.getTableOfContent()
        .subscribe(
          result => {
            console.info(result)
            if (result.hrefs.hasOwnProperty('events')) {
              this.eventsHref = result.hrefs['events']
              subscriber.next(this.eventsHref)
            }
            else {
              console.error('TOC is missing events')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })
    })
  }

}

// Data Transfer Objects, Data Payload Objects

export interface RegistrationsInfoResponse extends IRegistrationsInfo {
}

export interface EventResponse extends IEvent {
}

export interface RegistrationsResponse extends IRegistrations {
}

export interface RegistrationResponse extends IRegistration {
}

interface EventsInfoResponse {
  hrefs: { [key: string]: string; };
}

interface EventsResponse {
  data: EventResponse[]
  hrefs: { [key: string]: string }
}
