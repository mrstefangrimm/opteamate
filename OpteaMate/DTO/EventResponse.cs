﻿// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace opteamate {
  public class EventResponse : WebApiResponseBase<EventData> {
    public override string Type => WebApiResponseType.Resource.ToString();
    public long Id { get; set; }
    public RegistrationsResponse Registrations { get; set; }
  }
}
