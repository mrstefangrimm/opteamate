// Copyright (c) 2020-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Collares;
using OpteaMate.Domain;

namespace OpteaMate.Web {
  using RegistrationsResponse = WebApiCollectionResponse<RegistrationResponse, RegistrationData>;

  public class EventResponse : WebApiResourceResponse<EventData> {
    public RegistrationsResponse Registrations { get; } = new RegistrationsResponse();
  }
}
