﻿// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;

namespace RestBunch {

  public interface IWebApiResponse {
    string Type { get; }
    IDictionary<string, string> Hrefs { get; }
  }
}
