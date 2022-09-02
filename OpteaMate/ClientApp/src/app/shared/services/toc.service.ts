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
    @Inject('BASE_URL') private readonly baseUrl: string,
    @Inject('PROD_MODE') private readonly isProduction: boolean) {
  }

  getTableOfContent(): Observable<TocResponse> {

    if (this.isProduction) {
      let request = 'https://webaepp.dynv6.net:50446/api/toc'
      console.info(request)
      return this.http.get<TocResponse>(request)
    }
    else {
      let request = this.baseUrl + 'api/toc'
      console.info(request)
      return this.http.get<TocResponse>(request)
    }
  }

}

// Data Transfer Objects, Data Payload Objects

export interface TocResponse {
  hrefs: { [key: string]: string }
}
