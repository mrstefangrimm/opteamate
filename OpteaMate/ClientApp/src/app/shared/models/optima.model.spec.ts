// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { Optimum, IOptimumData } from './optima.model'
import { OptimumResponse } from '../services/optima.service'

describe('Optimum', () => {

  let givenOptimumHttp: OptimumResponse
  let target; Optimum

  beforeEach(() => {
    target = null

    givenOptimumHttp = {
      id: 12,
      data: { name: 'any', maximum: null, overrepresentationMatrix: null, strategies: '1-1;10-10', roles: 'A;B' }
    }
  })

  afterEach(() => {
    target = null
    givenOptimumHttp = null
  })

  it('given :null: when :created: then :constructor may throws error:', () => {
    expect(function () { new Optimum(null) }).toThrow()
  })

  it('given :two roles: when :created: then :constructor should create two roles:', () => {

    // TODO: Factory
    let opt = {
      id: givenOptimumHttp.id,
      data: givenOptimumHttp.data,
      roles: []
    }
    target = new Optimum(opt)

    expect(target.roles.length).toEqual(2)
  })

})

