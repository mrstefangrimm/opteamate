// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;

namespace opteamate {
  interface IHypermediaDto {
    Dictionary<string, string> Links { get; }
    Dictionary<string, string> Actions { get; }
  }
}
