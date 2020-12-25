﻿// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace OpteaMate.Web.Toc.Domain {
  public class TocServiceFake : ITocService {
    public string GetBaseUrl() {
      return "http://localhost:4700";
    }
  }
}
