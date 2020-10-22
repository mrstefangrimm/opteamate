// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;

namespace opteamate {
  public class OptimaResponse : WebApiResponseBase<ICollection<OptimumResponse>> {
    public override string Type => WebApiResponseType.Collection.ToString();
  }
}
