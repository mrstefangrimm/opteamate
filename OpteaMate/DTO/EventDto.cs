// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace opteamate {
  public class EventDto : HypermediaDtoBase<EventData> {
    public RegistrationsDto Registrations { get; set; }
  }
}
