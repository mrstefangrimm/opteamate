﻿// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using OpteaMate.Domain;
using RestBunch;

namespace OpteaMate.Web {
  public class RegistrationsInfoResponse : WebApiResponseBase<RegistrationsInfoData> {
    public override string Type => WebApiResponseType.Collection.ToString();
  }
}
