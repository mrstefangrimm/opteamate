// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;

namespace opteamate {
  public class EventDbo : EventData {
    public long EventDboId { get; set; }
    public bool Locked { get; set; }

    //public long OptimumDboId { get; set; }
    //public OptimumDbo OptimumDbo { get; set; }

    public List<RegistrationDbo> Registrations { get; set; }
  }
}
