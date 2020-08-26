﻿// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace opteamate {

public class OptimumDto : HypermediaDtoBase<OptimumData> {
    public RegistrationsDto Registrations { get; set; }
  }
}
