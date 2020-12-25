// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System;
using System.ComponentModel.DataAnnotations;

namespace OpteaMate.Domain {
  public class RegistrationData {
    [Required] public string Name { get; set; }
    [Required] public string Role { get; set; }
    [Required] public DateTime CreationTime { get; set; }
    public string Offers { get; set; }
  }
}
