// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class TocService {

  constructor(
    private readonly http: HttpClient,
    @Inject('BASE_URL') private readonly baseUrl: string) {
  }

  getTableOfContent(): Observable<TocResponse> {
    let tocRequest = this.baseUrl + 'api/toc'
    return this.http.get<TocResponse>(tocRequest)     
  }

}

// Data Transfer Objects, Data Payload Objects

export interface TocResponse {
  hrefs: { [key: string]: string }
}
