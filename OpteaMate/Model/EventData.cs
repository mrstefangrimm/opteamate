// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System;

namespace opteamate
{
  public class EventData {
    public long EventDboId { get; set; }
    public Guid EventToken { get; set; }

    public string Title { get; set; }
    public string Location { get; set; }
    public DateTime Start { get; set; }
    public long OptimumDboId { get; set; }
    public Guid SeriesToken { get; set; }
  }
}
