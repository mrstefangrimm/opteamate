// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;

namespace opteamate {
  public abstract class WebApiResponseBase<TDATA> : IWebApiResponse {
    public abstract string Type { get;  }
    public TDATA Data { get; set; }
    public IDictionary<string, string> Hrefs { get; } = new Dictionary<string, string>();
    public IList<string> Permissions { get; } = new List<string>();
  }
}
