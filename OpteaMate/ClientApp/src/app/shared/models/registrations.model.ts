// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//


export class RegistrationData {
  name: string
  role: string
  offers: string
  creationTime: Date
  transientScratch: boolean
}

export interface Registration {
  id: number
  data: RegistrationData
  hrefs: { [key: string]: string }
}

export interface Registrations {
  data: Registration[]
  hrefs: { [key: string]: string }
}

export interface RegistrationsInfoData {
  numRegistrations: number
  hasSponsors: boolean
}

export interface RegistrationsInfo {
  data: RegistrationsInfoData
}
