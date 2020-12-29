// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { IOptimum } from './optima.model'
import { IRegistrations } from './registrations.model'

export class OptimumStatData {
  nextOptimum: number
  registrations: number
  missing: number
  remaining: number
  overrepresentation: number
  maximum: number
}

export class EventStats {
  totNumRegistrations: number
  theOptima: { [role: string]: OptimumStatData } = {}
  prevOptima: { [role: string]: number } = {}
}

export interface IEvent {
  id: number
  data: EventData
  hrefs: { [key: string]: string }
  registrations: IRegistrations
}

export class Event implements IEvent {

  id: number
  data: EventData
  hrefs: { [key: string]: string }
  registrations: IRegistrations

  constructor(other: IEvent, readonly stats: EventStats) {
    if (other == null) throw new Error('other')
    if (stats == null) throw new Error('stats')

    this.id = other.id
    this.data = other.data
    this.hrefs = other.hrefs
    this.registrations = other.registrations

    this.stats.totNumRegistrations = other.registrations.data.length
  }

  fillStats(optimum: IOptimum) {

    let stratStr = optimum.data.strategies
    let strategies = stratStr.split(';')

    optimum.roles.forEach(pos => {
      this.stats.prevOptima[pos] = 0
    })

    for (let s = 0; s < strategies.length; s++) {
      let optimaStrs = strategies[s].split('-')

      for (let p = 0; p < optimum.roles.length; p++) {
        let pos = optimum.roles[p]
        let statData = new OptimumStatData
        statData.registrations = this.registrations == null ? 0 : this.registrations.data.filter(item => item.data.role == pos).length
        if (optimaStrs[p] == '*') {
          statData.nextOptimum = statData.registrations + 1
          statData.missing = 0
          statData.remaining = 0
        }
        else {
          statData.nextOptimum = +optimaStrs[p]
          let diff = statData.nextOptimum - statData.registrations
          let hasNextOptimum = diff > 0
          if ((diff < 0 && this.stats.prevOptima[pos] == 0) || (!hasNextOptimum && s == strategies.length - 1)) {
            statData.remaining = statData.registrations - statData.nextOptimum
          }
          else {
            statData.remaining = statData.registrations - this.stats.prevOptima[pos]
          }
          if (this.stats.prevOptima[pos] == 0) {
            statData.missing = Math.max(0, diff)
          }
          else {
            statData.missing = 0
          }
        }
        this.stats.theOptima[pos] = statData
      }

      let continueCondition = (s != strategies.length - 1)
      optimum.roles.forEach(pos => {
        let statData = this.stats.theOptima[pos]
        let diff = statData.nextOptimum - statData.registrations
        if (diff > 0) {
          continueCondition = false
        }
        this.stats.prevOptima[pos] = statData.nextOptimum
      })

      if (!continueCondition) {

        // Check for overrepresentation
        if (optimum.data.overrepresentationMatrix) {
          let overrepStr = optimum.data.overrepresentationMatrix
          let overrepRows = overrepStr.split(';')

          let overrepMat: Array<Float32Array> = new Array<Float32Array>()
          for (let n = 0; n < optimum.roles.length; n++) {
            let overrepCols = overrepRows[n].split(',')
            let fa = new Float32Array(3)
            for (let m = 0; m < optimum.roles.length; m++) {
              fa[m] = +overrepCols[m];
            }
            overrepMat.push(fa)
          }
          console.log(overrepMat)

          let overrepVec: Float32Array = new Float32Array(optimum.roles.length)
          for (let n = 0; n < optimum.roles.length; n++) {
            overrepVec[n] = 0
            for (let m = 0; m < optimum.roles.length; m++) {
              let statData = this.stats.theOptima[optimum.roles[m]]
              overrepVec[n] += statData.registrations * overrepMat[n][m]
            }
          }
          console.log(overrepVec)
          for (let n = 0; n < optimum.roles.length; n++) {
            let statData = this.stats.theOptima[optimum.roles[n]]
            if (overrepVec[n] > 0) {
              // Correction
              if (optimaStrs[n] == '*') {
                statData.nextOptimum -= 1
              }
              statData.remaining = statData.overrepresentation = Math.ceil(overrepVec[n])
            }
            else {
              statData.overrepresentation = 0
            }
          }
        }

        // Check for max. number of participants
        if (optimum.data.maximum) {
          let maximumStr = optimum.data.maximum
          console.log(maximumStr)
          let maximumPerPos = maximumStr.split('-')
          for (let n = 0; n < optimum.roles.length; n++) {
            let statData = this.stats.theOptima[optimum.roles[n]]
            statData.maximum = +maximumPerPos[n]
            // Correction
            statData.nextOptimum = Math.min(statData.nextOptimum, statData.maximum)
            // Check maximum if remaining is 0, i.e. the other rules did not apply
            if (statData.remaining == 0 && statData.registrations - statData.maximum > 0) {
              statData.remaining = statData.registrations - statData.maximum
            }
          }
        }

        // Check for a minimal number of registrations
        let someMissing = false
        optimum.roles.forEach(pos => {
          let statData = this.stats.theOptima[pos]
          if (statData.missing > 0) {
            someMissing = true
          }
        })
        console.info(someMissing)
        if (someMissing && this.registrations != null) {
          this.registrations.data.forEach(reg => reg.data.transientScratch = true)
        }
        else {
          // Set scratch based on creation time
          optimum.roles.forEach(pos => {
            let statData = this.stats.theOptima[pos]
            if (statData.remaining > 0 && this.registrations != null) {
              let regForPos = this.registrations.data.filter(item => item.data.role == pos)
              regForPos.sort((a, b) => +new Date(b.data.creationTime) - +new Date(a.data.creationTime))

              for (let n = 0; n < statData.remaining; n++) {
                regForPos[n].data.transientScratch = true
              }
            }

          })
        }
        return
      }
    }
  }

  allOfferings(): string {
    let offerings: string = ', '
    if (this.registrations != null && this.registrations.data != null) {
      offerings = ''
      this.registrations.data.forEach(x => {
        if (x.data.offers != null && x.data.offers.length > 0) {
          offerings += x.data.offers + " (" + x.data.name + "), "
        }
      })
    }
    return offerings.substr(0, offerings.length-2)
  }

}

export class EventData {
  eventToken: string
  title: string
  location: string
  start: Date
  optimumId: number
  seriesToken: string
}
