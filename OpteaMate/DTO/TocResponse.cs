﻿// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;

namespace opteamate {
  public class TocResponse : IWebApiResponse {
    public string Type => WebApiResponseType.Collection.ToString();
    public object Data { get; }
    public IDictionary<string, string> Hrefs { get; } = new Dictionary<string, string>();
  }
}
