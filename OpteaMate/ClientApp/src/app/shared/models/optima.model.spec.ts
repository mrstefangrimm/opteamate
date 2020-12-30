// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { Optimum } from './optima.model'
import { OptimumResponse } from '../services/optima.service'

describe('Optimum', () => {

  let givenOptimumHttp: OptimumResponse
  let target; Optimum

  beforeEach(() => {
    target = null

    givenOptimumHttp = {
      id: 12,
      data: { name: 'any', maximum: '10-11-12', overrepresentationMatrix: null, strategies: '6-4-1;9-6-1;12-9-2', roles: 'A;B;C', seriesToken: null }
    }
  })

  afterEach(() => {
    target = null
    givenOptimumHttp = null
  })

  it('given :null: when :created: then :constructor may throws error:', () => {
    expect(function () { new Optimum(null) }).toThrow()
  })

  it('given :three roles: when :created: then :constructor should create three roles:', () => {

    // TODO: Factory
    let opt = {
      id: givenOptimumHttp.id,
      data: givenOptimumHttp.data,
      roles: []
    }
    target = new Optimum(opt)

    expect(target.roles.length).toEqual(3)
  })

  it('given :three roles and two optima: when :getOptimaAsMatrix: then :matrix 3x4 is created:', () => {

    // TODO: Factory
    let opt = {
      id: givenOptimumHttp.id,
      data: givenOptimumHttp.data,
      roles: []
    }
    target = new Optimum(opt)
    const mat = target.getOptimaAsMatrix()

    expect(mat.length).toEqual(4)
    expect(mat[0].length).toEqual(3)

    console.debug(mat)
  })

  it('given :dictionary: when :setMaximaFromDictonary: then :data maximum is updated:', () => {

    let maxima: { [role: string]: string } = {}
    maxima['A'] = '100'
    maxima['B'] = '110'
    maxima['C'] = '120'
      
    // TODO: Factory
    let opt = {
      id: givenOptimumHttp.id,
      data: givenOptimumHttp.data,
      roles: []
    }
    target = new Optimum(opt)
    target.setMaximaFromDictonary(maxima)
        
    expect(target.data.maximum).toEqual('100-110-120')

    console.debug(target)
  })

  it('given :three roles with maximum: when :getMaximaAsDictonary: then :dict with length 3 is created:', () => {

    // TODO: Factory
    let opt = {
      id: givenOptimumHttp.id,
      data: givenOptimumHttp.data,
      roles: []
    }
    target = new Optimum(opt)
    const dict = target.getMaximaAsDictonary()
    
    expect(Object.keys(dict).length).toEqual(3)

    console.debug(dict)
  })

  it('given :dictonary: when :setOptimaFromMatrix: then :data roles and strategies are updated:', () => {

    const mat = new Array<Array<string>>()
    const roles: string[] = ['Aa', 'Bb', 'Cc']
    mat.push(roles)
    const opt1: string[] = ['60', '40', '10']
    mat.push(opt1)
    const opt2: string[] = ['90', '60', '10']
    mat.push(opt2)
    const opt3: string[] = ['120', '90', '20']
    mat.push(opt3)

    // TODO: Factory
    let opt = {
      id: givenOptimumHttp.id,
      data: givenOptimumHttp.data,
      roles: []
    }
    target = new Optimum(opt)
    target.setOptimaFromMatrix(mat)


    expect(target.data.roles).toEqual('Aa;Bb;Cc')
    // expect(mat[0].length).toEqual(3)

    console.debug(target)
  })

})

