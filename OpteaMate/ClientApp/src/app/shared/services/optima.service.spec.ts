// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { of } from 'rxjs'
import { OptimaSerivce, OptimumResponse } from './optima.service'
import { TocResponse } from './toc.service'

describe('OptimaHttpService', () => {

  let httpClientSpy: { get: jasmine.Spy }
  let tocServiceSpy: { getTableOfContent: jasmine.Spy }
  let target: OptimaSerivce

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get'])
    tocServiceSpy = jasmine.createSpyObj('TocService', ['getTableOfContent'])
    target = new OptimaSerivce(httpClientSpy as any, tocServiceSpy as any)
  })

  afterEach(() => {
    target = null
  })

  it('given :optima entry in TOC: when :getOptima: then :optimas should be returned:', () => {

    const givenTocResponse: TocResponse = { hrefs: {} }
    givenTocResponse.hrefs['optima'] = 'aLocation'
    tocServiceSpy.getTableOfContent.and.returnValue(of(givenTocResponse))

    const givenOptimaResponse = { data: [] }
    givenOptimaResponse.data.push(createOptimaResponse())
    httpClientSpy.get.and.returnValue(of(givenOptimaResponse))

    target.getOptima().subscribe(
      result => {
        expect(result).toBe(givenOptimaResponse)
      },
      fail
    )

    expect(tocServiceSpy.getTableOfContent.calls.count()).toEqual(1)
    expect(httpClientSpy.get.calls.count()).toEqual(1)
  })

  it('given :optima entry not in TOC: when :getOptima: then :error should be returned:', () => {

    const givenTocResponse: TocResponse = { hrefs: {} }
    givenTocResponse.hrefs['noopt'] = 'aLocation'
    tocServiceSpy.getTableOfContent.and.returnValue(of(givenTocResponse))

    const givenOptimaResponse = { data: [] }
    givenOptimaResponse.data.push(createOptimaResponse())
    httpClientSpy.get.and.returnValue(of(givenOptimaResponse))

    target.getOptima().subscribe(
      result => fail,
      () => { }
    )

    expect(tocServiceSpy.getTableOfContent.calls.count()).toEqual(1)
    expect(httpClientSpy.get.calls.count()).toEqual(0)
  })

  it('given :optima entry in TOC is undefined: when :getOptima: then :error should be returned:', () => {

    const givenTocResponse: TocResponse = { hrefs: {} }
    givenTocResponse.hrefs['optima'] = undefined
    tocServiceSpy.getTableOfContent.and.returnValue(of(givenTocResponse))

    const givenOptimaResponse = { data: [] }
    givenOptimaResponse.data.push(createOptimaResponse())
    httpClientSpy.get.and.returnValue(of(givenOptimaResponse))

    target.getOptima().subscribe(
      result => fail,
      () => { }
    )

    expect(tocServiceSpy.getTableOfContent.calls.count()).toEqual(1)
    expect(httpClientSpy.get.calls.count()).toEqual(0)
  })

  it('given :optima entry in TOC: when :getOptima is called twice: then :TOC should be called once:', () => {

    const givenTocResponse: TocResponse = { hrefs: {} }
    givenTocResponse.hrefs['optima'] = 'aLocation'
    tocServiceSpy.getTableOfContent.and.returnValue(of(givenTocResponse))

    const givenOptimaResponse = { data: [] }
    givenOptimaResponse.data.push(createOptimaResponse())
    httpClientSpy.get.and.returnValue(of(givenOptimaResponse))

    target.getOptima().subscribe(
      result => {
        expect(result).toBe(givenOptimaResponse)
      },
      fail
    )

    target.getOptima().subscribe(
      result => {
        expect(result).toBe(givenOptimaResponse)
      },
      fail
    );

    expect(tocServiceSpy.getTableOfContent.calls.count()).toEqual(1)
    expect(httpClientSpy.get.calls.count()).toEqual(2)
  })

  it('given :optima entry in TOC and valid optimum ID: when :getOptimum: then :optimum should be returned:', () => {

    const givenTocResponse: TocResponse = { hrefs: {} }
    givenTocResponse.hrefs['optima'] = 'aLocation'
    tocServiceSpy.getTableOfContent.and.returnValue(of(givenTocResponse))

    const givenOptimumResponse: OptimumResponse = {
      id: 12, data: { name: 'any', maximum: '100-100', overrepresentationMatrix: null, roles: 'A;B', strategies: '*-*', seriesToken: null }
    }
    httpClientSpy.get.and.returnValue(of(givenOptimumResponse))

    target.getOptimum(12).subscribe(
      result => {
        expect(result).toBe(givenOptimumResponse)
      },
      fail
    )

    expect(tocServiceSpy.getTableOfContent.calls.count()).toEqual(1)
    expect(httpClientSpy.get.calls.count()).toEqual(1)
  })

  it('given :optima entry in not TOC and valid optimum ID: when :getOptimum: then :error should be returned:', () => {

    const givenTocResponse: TocResponse = { hrefs: {} }
    givenTocResponse.hrefs['noopt'] = 'aLocation'
    tocServiceSpy.getTableOfContent.and.returnValue(of(givenTocResponse))

    const givenOptimumResponse: OptimumResponse = {
      id: 12, data: { name: 'any', maximum: '100-100', overrepresentationMatrix: null, roles: 'A;B', strategies: '*-*', seriesToken: null }
    }
    httpClientSpy.get.and.returnValue(of(givenOptimumResponse))

    target.getOptimum(12).subscribe(
      result => fail,
      () => { }
    )

    expect(tocServiceSpy.getTableOfContent.calls.count()).toEqual(1)
    expect(httpClientSpy.get.calls.count()).toEqual(0)
  })

  it('given :optima entry in TOC is undefined and valid optimum ID: when :getOptimum: then :error should be returned:', () => {

    const givenTocResponse: TocResponse = { hrefs: {} }
    givenTocResponse.hrefs['optima'] = undefined
    tocServiceSpy.getTableOfContent.and.returnValue(of(givenTocResponse))

    const givenOptimumResponse: OptimumResponse = {
      id: 12, data: { name: 'any', maximum: '100-100', overrepresentationMatrix: null, roles: 'A;B', strategies: '*-*', seriesToken: null }
    }
    httpClientSpy.get.and.returnValue(of(givenOptimumResponse))

    target.getOptimum(12).subscribe(
      result => fail,
      () => { }
    )

    expect(tocServiceSpy.getTableOfContent.calls.count()).toEqual(1)
    expect(httpClientSpy.get.calls.count()).toEqual(0)
  })

  it('given :optima entry in TOC and valid optimum ID: when :getOptimum is called twice: then :TOC should be called once:', () => {

    const givenTocResponse: TocResponse = { hrefs: {} }
    givenTocResponse.hrefs['optima'] = 'aLocation'
    tocServiceSpy.getTableOfContent.and.returnValue(of(givenTocResponse))

    const givenOptimumResponse: OptimumResponse = {
      id: 12, data: { name: 'any', maximum: '100-100', overrepresentationMatrix: null, roles: 'A;B', strategies: '*-*', seriesToken: null }
    }
    httpClientSpy.get.and.returnValue(of(givenOptimumResponse))

    target.getOptimum(12).subscribe(
      result => {
        expect(result).toBe(givenOptimumResponse)
      },
      fail
    )

    target.getOptimum(12).subscribe(
      result => {
        expect(result).toBe(givenOptimumResponse)
      },
      fail
    )

    expect(tocServiceSpy.getTableOfContent.calls.count()).toEqual(1)
    expect(httpClientSpy.get.calls.count()).toEqual(2)
  })

})

function createOptimaResponse(): OptimumResponse {
  return {
    id: 45,
    data: { name: 'any', maximum: null, overrepresentationMatrix: null, strategies: '*-*', roles: 'A;B', seriesToken: null }
  }
}
