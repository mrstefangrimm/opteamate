// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace opteamate {

internal enum LinkType {
    self,
    home,
    back,
    first,
    prev,
    next,
    last,
    other,
    routerLink
  }

  internal enum ActionType {
    GET,
    PUSH,
    POP,
    PATCH,
    DELETE
  }

  internal static class HypermediaUtil {
    public static void AddLink(this IHypermediaDto target, LinkType type, string value) {
      target.Links.Add(type.ToString(), value?.ToLower());
    }

    public static void AddAction(this IHypermediaDto target, ActionType type, string value) {
      target.Actions.Add(type.ToString(), value?.ToLower());
    }

    public static HypermediaDtoBase<TDATA> CreateHypermediaDto<TDATA>(TDATA data) {
      return new HypermediaDtoBase<TDATA> { Data = data };
    }
  }
}