// https://embed.plnkr.co/l1oTNT/

import { PipeTransform, Pipe } from '@angular/core'
import { IRegistration } from '../shared/models/registrations.model'

@Pipe({
  name: 'rosterfilter',
  pure: false
})
export class RegistrationRosterPipe implements PipeTransform {
  transform(items: IRegistration[], filter: string): any {
    var allOfRole = items.filter(item => item.data.role == filter && item.data.transientScratch != true)
    allOfRole.sort((a, b) => +new Date(a.data.creationTime) - +new Date(b.data.creationTime))
    return allOfRole
  }
}

@Pipe({
  name: 'scratchfilter',
  pure: false
})
export class RegistrationScratchPipe implements PipeTransform {
  transform(items: IRegistration[], filter: string): any {
    var allOfRole = items.filter(item => item.data.role == filter && item.data.transientScratch == true)
    allOfRole.sort((a, b) => +new Date(a.data.creationTime) - +new Date(b.data.creationTime))
    return allOfRole
  }
}
