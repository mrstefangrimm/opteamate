// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

export interface IOptimumData {
  name: string
  strategies: string
  roles: string
  overrepresentationMatrix: string
  maximum: string
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

  constructor(readonly other: IOptimum) {
    if (other == null) throw new Error('other')

    this.id = other.id
    this.data = other.data

    let posStr = this.data.roles
    this.roles = posStr.split(';')
  }

}
