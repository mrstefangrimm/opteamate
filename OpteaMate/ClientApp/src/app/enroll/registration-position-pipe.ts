// https://embed.plnkr.co/l1oTNT/

import { PipeTransform, Pipe } from '@angular/core'
import { RegistrationResponse } from './registration.component'

@Pipe({
  name: 'rosterfilter',
  pure: false
})
export class RegistrationRosterPipe implements PipeTransform {
  transform(items: RegistrationResponse[], filter: string): any {
    var allOfPosiion = items.filter(item => item.data.position == filter && item.data.transientScratch != true)
    allOfPosiion.sort((a, b) => +new Date(a.data.creationTime) - +new Date(b.data.creationTime))
    return allOfPosiion
  }
}

@Pipe({
  name: 'scratchfilter',
  pure: false
})
export class RegistrationScratchPipe implements PipeTransform {
  transform(items: RegistrationResponse[], filter: string): any {
    var allOfPosiion = items.filter(item => item.data.position == filter && item.data.transientScratch == true)
    allOfPosiion.sort((a, b) => +new Date(a.data.creationTime) - +new Date(b.data.creationTime))
    return allOfPosiion
  }
}
