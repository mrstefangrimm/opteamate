// https://embed.plnkr.co/l1oTNT/

import { PipeTransform, Pipe } from '@angular/core';
import { RegistrationData } from './registration.component';

@Pipe({
  name: 'rosterfilter',
  pure: false
})
export class RegistrationRosterPipe implements PipeTransform {
  transform(items: RegistrationData[], filter: string): any {
    var allOfPosiion = items.filter(item => item.position == filter && item.transientScratch != true)
    allOfPosiion.sort((a, b) => +new Date(a.creationTime) - +new Date(b.creationTime))
    return allOfPosiion
  }
}

@Pipe({
  name: 'scratchfilter',
  pure: false
})
export class RegistrationScratchPipe implements PipeTransform {
  transform(items: RegistrationData[], filter: string): any {
    var allOfPosiion = items.filter(item => item.position == filter && item.transientScratch == true)
    allOfPosiion.sort((a, b) => +new Date(a.creationTime) - +new Date(b.creationTime))
    return allOfPosiion
  }
}
