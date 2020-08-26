// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace opteamate {
public class RegistrationDbo : RegistrationData {
    public long RegistrationDboId { get; set; }

    public long EventDboId { get; set; }
    public EventDbo EventDbo { get; set; }
  }
}
