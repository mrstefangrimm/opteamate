// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;

namespace opteamate {
  public class HypermediaDtoBase<TDATA> : IHypermediaDto {
    public TDATA Data { get; set; }
    public Dictionary<string, string> Links { get; } = new Dictionary<string, string>();
    public Dictionary<string, string> Actions { get; } = new Dictionary<string, string>();
  }
}
