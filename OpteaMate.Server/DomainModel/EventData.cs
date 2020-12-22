// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System;
using System.ComponentModel.DataAnnotations;

namespace OpteaMate.Domain {
  public class EventData {
    [Required]
    public Guid EventToken { get; set; }    
    [Required]
    public long OptimumId { get; set; }

    [Required]
    public DateTime Start { get; set; }
    public string Title { get; set; }
    public string Location { get; set; }
    public Guid? SeriesToken { get; set; }
    public DateTime? Deadline { get; set; }
  }
}
