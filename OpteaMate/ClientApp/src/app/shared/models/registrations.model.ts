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

export interface IRegistration {
  id: number
  data: RegistrationData
  hrefs: { [key: string]: string }
}

export interface IRegistrations {
  data: IRegistration[]
  hrefs: { [key: string]: string }
}

export interface IRegistrationsInfoData {
  numRegistrations: number
  hasSponsors: boolean
}

export interface IRegistrationsInfo {
  data: IRegistrationsInfoData
}
