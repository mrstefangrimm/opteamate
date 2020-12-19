// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { EventResponse } from '../services/events.service'
import { OptimumResponse } from '../services/optima.service'
import { Event, EventData, EventStats } from './events.model'
import { Optimum } from './optima.model'
import { IRegistration, RegistrationData } from './registrations.model'

describe('Event', () => {

  let givenEventFromHttp: EventResponse
  let givenOptimumFromHttp: OptimumResponse
  let target: Event

  beforeEach(() => {
    target = null
    let data = new EventData
    data = new EventData
    data.eventToken = 'any'
    data.location = 'any'
    data.optimumId = 1
    data.start = new Date
    data.title = 'any'

    givenEventFromHttp = {
      id: 21,
      data: data,
      registrations: { data: [], hrefs: {} },
      hrefs: {}
    }

    givenOptimumFromHttp = {
      id: 1,
      data: { name: 'any', maximum: '100-100', overrepresentationMatrix: null, strategies: '1-1', roles: 'A;B' }    }
  })

  afterEach(() => {
    target = null
    givenEventFromHttp = null
    givenOptimumFromHttp = null
  })

  it('given :null: when :created: then :constructor may throws error:', () => {
    expect(function () { new Event(null, null) }).toThrow()
  })

  it('given :null argument: when :created: then :constructor may throws error:', () => {
    expect(function () { new Event(null, new EventStats()) }).toThrow()
    expect(function () { new Event(givenEventFromHttp, null) }).toThrow()
  })

  it('given :null argument: when :fillStats: then :may throws error:', () => {    
    target = new Event(givenEventFromHttp, new EventStats)
    expect(function () { target.fillStats(null) }).toThrow()
  })

  it('given :appointment with 0 registrations: when :fillStats: then :total number of registrations should be 0:', () => {
    givenOptimumFromHttp.data.strategies = '2;*'
    givenOptimumFromHttp.data.roles = 'Participant'

    target = new Event(givenEventFromHttp, new EventStats)
    // TODO: Factory
    let opt = {
      id: givenOptimumFromHttp.id,
      data: givenOptimumFromHttp.data,
      roles: []
    }
    target.fillStats(new Optimum(opt))

    expect(target.stats.totNumRegistrations).toEqual(0)
  })

  it('given :appointment with 1 registration: when :fillStats: then :one participant should be missing:', () => {
    givenOptimumFromHttp.data.strategies = '2;*'
    givenOptimumFromHttp.data.roles = 'Participant'

    givenEventFromHttp.registrations.data.push(createRegistration('Participant'))

    target = new Event(givenEventFromHttp, new EventStats)
    // TODO: Factory
    let opt = {
      id: givenOptimumFromHttp.id,
      data: givenOptimumFromHttp.data,
      roles: []
    }
    target.fillStats(new Optimum(opt))

    expect(target.stats.totNumRegistrations).toEqual(1)
    expect(target.stats.theOptima['Participant'].missing).toEqual(1)
    expect(target.stats.theOptima['Participant'].nextOptimum).toEqual(2)
  })

  it('given :appointment with 2 registrations: when :fillStats: then :0 participants should be missing:', () => {
    givenOptimumFromHttp.data.strategies = '2;*'
    givenOptimumFromHttp.data.roles = 'Participant'

    givenEventFromHttp.registrations.data.push(createRegistration('Participant'))
    givenEventFromHttp.registrations.data.push(createRegistration('Participant'))

    target = new Event(givenEventFromHttp, new EventStats)
    // TODO: Factory
    let opt = {
      id: givenOptimumFromHttp.id,
      data: givenOptimumFromHttp.data,
      roles: []
    }
    target.fillStats(new Optimum(opt))

    expect(target.stats.totNumRegistrations).toEqual(2)
    expect(target.stats.theOptima['Participant'].missing).toEqual(0)
    expect(target.stats.theOptima['Participant'].nextOptimum).toEqual(3)
  })

  it('given :rendez-vous with 0 registrations: when :fillStats: then :total number of registrations should be 0', () => {
    givenOptimumFromHttp.data.strategies = '1-1*'
    givenOptimumFromHttp.data.roles = 'Woman;Man'

    target = new Event(givenEventFromHttp, new EventStats)
    // TODO: Factory
    let opt = {
      id: givenOptimumFromHttp.id,
      data: givenOptimumFromHttp.data,
      roles: []
    }
    target.fillStats(new Optimum(opt))

    expect(target.stats.totNumRegistrations).toEqual(0)
  })

  it('given :rendez-vous with 1 man: when :fillStats: then :1 woman should be missing:', () => {
    givenOptimumFromHttp.data.strategies = '1-1'
    givenOptimumFromHttp.data.roles = 'Woman;Man'

    givenEventFromHttp.registrations.data.push(createRegistration('Man'))

    target = new Event(givenEventFromHttp, new EventStats)
    // TODO: Factory
    let opt = {
      id: givenOptimumFromHttp.id,
      data: givenOptimumFromHttp.data,
      roles: []
    }
    target.fillStats(new Optimum(opt))

    expect(target.stats.totNumRegistrations).toEqual(1)
    expect(target.stats.theOptima['Woman'].missing).toEqual(1)
    expect(target.stats.theOptima['Woman'].nextOptimum).toEqual(1)
    expect(target.stats.theOptima['Man'].missing).toEqual(0)
    expect(target.stats.theOptima['Man'].nextOptimum).toEqual(1)
  })

  it('given :rendez-vous with 2 men and one woman: when :fillStats: then :1 woman should be missing and 1 man should be remaining:', () => {
    givenOptimumFromHttp.data.strategies = '1-1'
    givenOptimumFromHttp.data.roles = 'Woman;Man'

    givenEventFromHttp.registrations.data.push(createRegistration('Woman'))
    givenEventFromHttp.registrations.data.push(createRegistration('Man'))
    givenEventFromHttp.registrations.data.push(createRegistration('Man'))

    target = new Event(givenEventFromHttp, new EventStats)
    // TODO: Factory
    let opt = {
      id: givenOptimumFromHttp.id,
      data: givenOptimumFromHttp.data,
      roles: []
    }
    target.fillStats(new Optimum(opt))

    expect(target.stats.totNumRegistrations).toEqual(3)
    expect(target.stats.theOptima['Woman'].missing).toEqual(0)
    expect(target.stats.theOptima['Woman'].remaining).toEqual(0)
    expect(target.stats.theOptima['Woman'].nextOptimum).toEqual(1)
    expect(target.stats.theOptima['Man'].missing).toEqual(0)
    expect(target.stats.theOptima['Man'].remaining).toEqual(1)
    expect(target.stats.theOptima['Man'].nextOptimum).toEqual(1)
  })

})

function createRegistration(role: string): IRegistration {

  let data: RegistrationData = {
    name: 'any',
    creationTime: new Date,
    offers: null,
    role: role,
    transientScratch: false
  }
  return {
    id: -1,
    data: data,
    hrefs: {}
  }
}
