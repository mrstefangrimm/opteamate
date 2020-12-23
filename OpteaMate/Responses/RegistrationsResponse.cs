// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using RestBunch;
using System.Collections.Generic;

namespace OpteaMate.Web {
  public class RegistrationsResponse : WebApiResponseBase<ICollection<RegistrationResponse>> {
    public override string Type => WebApiResponseType.Collection.ToString();
  }
}
