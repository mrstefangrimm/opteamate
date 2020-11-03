// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace opteamate {

  internal enum WebApiResponseType {
    Resource,
    Collection
  }

  internal enum HrefType {
    SELF,   // Domain specific
    BACK,   // Domain specific
    ROOT,   // Domain specific
    EVENTS, // Domain specific
    OPTIMA, // Domain specific
    // GET, Get of a collection is always possible
    POST,
    PUT,
    PATCH,
    DELETE
  }

  internal static class WebApiUtil {
    public static void AddHref(this IWebApiResponse target, HrefType type, string value) {
      target.Hrefs.Add(type.ToString().ToLower(), value?.ToLower());
    }
  }
}