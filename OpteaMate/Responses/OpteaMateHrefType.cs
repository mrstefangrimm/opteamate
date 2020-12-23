// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using RestBunch;

namespace OpteaMate.Web {

  internal class OpteaMateHrefType : HrefType {
    public static Val2Type<string> BACK = new Val2Type<string>("BACK");
    public static Val2Type<string> ROOT = new Val2Type<string>("ROOT");
    public static Val2Type<string> EVENTS = new Val2Type<string>("EVENTS");
    public static Val2Type<string> OPTIMA = new Val2Type<string>("OPTIMA");
  }

}