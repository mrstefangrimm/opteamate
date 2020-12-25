// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.ComponentModel.DataAnnotations;

namespace OpteaMate.Domain {
  public class OptimumData {
    [Required] public string Name { get; set; }
    [Required] public string Strategies { get; set; }
    [Required] public string Roles { get; set; }
    public string OverrepresentationMatrix { get; set; }
    public string Maximum { get; set; }
  }
}
