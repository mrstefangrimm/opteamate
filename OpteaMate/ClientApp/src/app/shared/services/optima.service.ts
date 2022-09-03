// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { TocService } from './toc.service'
import { OptimumData, TransferableOptimum } from '../models/optima.model'

@Injectable({ providedIn: 'root' })
export class OptimaSerivce {

  private optimaHref: string

  constructor(
    private readonly http: HttpClient,
    private readonly tocService: TocService) {
  }

  getOptima(): Observable<OptimaResponse> {

    let getOptimaFromHref = subscriber => {
      this.http.get<OptimaResponse>(this.optimaHref)
        .subscribe(
          result => {
            subscriber.next(result)
          },
          error => {
            console.error(error)
            subscriber.error()
          })
    }
    return new Observable<OptimaResponse>(subscriber => {
      if (this.optimaHref === undefined) {
        this.updateOptimaHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              getOptimaFromHref(subscriber)
            }
            else {
              console.error('HREF for optima is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })        
      }
      else {
        getOptimaFromHref(subscriber)
      }
    })
  } 

  getOptimaForSeries(token: string): Observable<OptimaResponse> {

    let getOptimaFromHref = subscriber => {
      let request = this.optimaHref + 'byseries?token=' + token
      console.info(request)
      this.http.get<OptimaResponse>(request)
        .subscribe(
          result => {
            subscriber.next(result)
          },
          error => {
            console.error(error)
            subscriber.error()
          })
    }
    return new Observable<OptimaResponse>(subscriber => {
      if (this.optimaHref === undefined) {
        this.updateOptimaHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              getOptimaFromHref(subscriber)
            }
            else {
              console.error('HREF for optima is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })
      }
      else {
        getOptimaFromHref(subscriber)
      }
    })
  } 

  getOptimum(id: number): Observable<OptimumResponse> {

    let getOptimumFromHref = (id, subscriber) => {
      let request = this.optimaHref + id
      console.info(request)
      this.http.get<OptimumResponse>(request).subscribe(
        result => {
          subscriber.next(result)
        },
        error => {
          console.error(error)
          subscriber.error()
        })
    }
    return new Observable<OptimumResponse>(subscriber => {
      if (this.optimaHref === undefined) {
        this.updateOptimaHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              getOptimumFromHref(id, subscriber)
            }
            else {
              console.error('HREF for optima is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })
      }
      else {
        getOptimumFromHref(id, subscriber)
      }
    })
  }

  postOptimum(data: OptimumData) {

    let postOptimumFromHref = (data, subscriber) => {
      let request = this.optimaHref
      console.info(request)
      this.http.post<OptimumResponse>(request, data).
        subscribe(
          result => {
            subscriber.next(result)
          },
          error => {
            console.error(error)
            subscriber.error()
          })
    }

    return new Observable<OptimumResponse>(subscriber => {
      if (this.optimaHref === undefined) {
        this.updateOptimaHrefFromToc().subscribe(
          result => {
            if (result != undefined) {
              postOptimumFromHref(data, subscriber)
            }
            else {
              console.error('HREF for optima is undefined.')
              subscriber.error()
            }
          },
          error => {
            console.error(error)
            subscriber.error()
          })
      }
      else {
        postOptimumFromHref(data, subscriber)
      }
    })
  }

  private updateOptimaHrefFromToc(): Observable<string> {
    return new Observable<string>(subscriber => {
      this.tocService.getTableOfContent().subscribe(
        result => {
          console.info(result)
          if (result.hrefs.hasOwnProperty('optima')) {
            this.optimaHref = result.hrefs['optima']
            subscriber.next(this.optimaHref)
          }
          else {
            console.error('TOC is missing optima')
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

export interface OptimumResponse extends TransferableOptimum<OptimumData> {
  id: number
  data: OptimumData
}

interface OptimaResponse {
  data: OptimumResponse[]
}
