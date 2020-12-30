// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { of } from 'rxjs'
import { TocResponse, TocService } from './toc.service'

describe('TocHttpService', () => {

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get'])
  let target: TocService


  beforeEach(() => {
    target = new TocService(httpClientSpy as any, 'http:/any/', false)
  })

  afterEach(() => {
    target = null
  })

  it('given :one entry in TOC: when :getTableOfContent: then :service location should be returned:', () => {
    const givenTocResponse: TocResponse = { hrefs: {} }
    givenTocResponse.hrefs['anId'] = 'aLocation'

    httpClientSpy.get.and.returnValue(of(givenTocResponse))

    target.getTableOfContent().subscribe(
      result => {
        expect(result.hrefs['anId']).toBe('aLocation')
      },
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call')
  })

})
