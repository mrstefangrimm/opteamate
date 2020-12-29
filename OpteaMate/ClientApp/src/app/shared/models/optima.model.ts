// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

export interface IOptimumData {
  name: string
  strategies: string
  roles: string
  overrepresentationMatrix: string
  maximum: string
  seriesToken: string
}

export interface IOptimum {
  id: number
  data: IOptimumData
  roles: string[]
}

export class Optimum implements IOptimum {

  id: number
  data: IOptimumData
  roles: string[]
  optima: string[]

  constructor(other: IOptimum) {
    if (other == null) throw new Error('other')

    this.id = other.id
    this.data = {
      name: other.data.name,
      strategies: other.data.strategies,
      roles: other.data.roles,
      overrepresentationMatrix: other.data.overrepresentationMatrix,
      maximum: other.data.maximum,
      seriesToken: other.data.seriesToken
    }
    this.optima = other.data.strategies.split(';')
    this.roles = this.data.roles.split(';')
  }

  getOptimaAsMatrix(): Array<Array<string>>{
    const mat = new Array<Array<string>>()
    mat.push(this.roles)
    for (let oi = 0; oi < this.optima.length; oi++) {
      let optArr = this.optima[oi].split('-').map(x => x)
      mat.push(optArr)
    }
    return mat
  }

  setOptimaFromMatrix(mat: Array<Array<string>>) {
    if (mat == null) throw new Error('mat')
    this.roles = mat[0]
    this.data.roles = this.roles.join(';')

    let optima = new Array<string>()
    mat.slice(1, mat.length).forEach(
      x => optima.push(x.join('-'))
    )    
    this.optima = optima
    this.data.strategies = this.optima.join(';')
  }

  addRole(name: string) {
    this.roles.push(name)
    console.info(this.roles)
    this.data.roles += ';' + name
    console.info(this.data.roles)

    for (let n = 0; n < this.optima.length; n++) {
      this.optima[n] = this.optima[n] + '-*'
    }
    console.info(this.optima)
  }

  addOptima() {
    let strOpt = '*'
    for (let n = 1; n < this.roles.length; n++) {
      strOpt += '-*'
    }
    this.optima.push(strOpt)
    console.info(this.optima)
    this.data.strategies += ';' + strOpt
    console.info(this.data.strategies)
 }

  getMaximaAsDictonary(): { [role: string]: string } {
    let maxima: { [role: string]: string } = {}
    for (let ri = 0; ri < this.roles.length; ri++) {
      let max = undefined
      if (this.data.maximum != null) {
        max = this.data.maximum.split('-')[ri]
      }
      maxima[this.roles[ri]] = max
    }
    return maxima
  }

  setMaximaFromDictonary(maxima: { [role: string]: string }) {
    const max = new Array<string>()
    this.roles.forEach(
      x => max.push(maxima[x])
    )
    this.data.maximum = max.join('-')
  }

  getOptima(role: string, num: number) {
    let roleIdx = this.roles.findIndex(r => role)

    let optimum = this.optima[num]
    return optimum.split('-')[roleIdx]
  }

}
