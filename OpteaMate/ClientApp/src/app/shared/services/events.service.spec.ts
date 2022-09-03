// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { of } from 'rxjs'
import { EventsService } from './events.service'
import { TocResponse } from './toc.service'

describe('EventsHttpService', () => {

  let httpClientSpy: { get: jasmine.Spy }
  let tocServiceSpy: { getTableOfContent: jasmine.Spy }
  let target: EventsService

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get'])
    tocServiceSpy = jasmine.createSpyObj('TocService', ['getTableOfContent'])
    target = new EventsService(httpClientSpy as any, tocServiceSpy as any)
  })

  afterEach(() => {
    target = null
  })

  it('given :event entry in TOC: when :getInfo: then :info should be returned:', () => {

    const givenTocResponse: TocResponse = { hrefs: {} }
    givenTocResponse.hrefs['events'] = 'aLocation'
    tocServiceSpy.getTableOfContent.and.returnValue(of(givenTocResponse))

    const givenEventsResponse = { hrefs: { } }
    httpClientSpy.get.and.returnValue(of(givenEventsResponse))

    target.getInfo().subscribe(
      result => {
        expect(result).toBe(givenEventsResponse)
      },
      fail
    )

    expect(tocServiceSpy.getTableOfContent.calls.count()).toEqual(1)
    expect(httpClientSpy.get.calls.count()).toEqual(1)
  })

})
