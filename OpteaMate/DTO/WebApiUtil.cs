// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace opteamate {

  internal enum WebApiResponseType {
    Resource,
    Collection
  }

  internal enum HrefType {
    SELF,
    BACK,
    ROOT,
    EVENTS,
    OPTIMA
  }

  internal enum PermissionsType {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE
  }

  internal static class WebApiUtil {

    public static void AddHref(this IWebApiResponse target, HrefType type, string value) {
      target.Hrefs.Add(type.ToString().ToLower(), value?.ToLower());
    }

    public static void AddPermission(this IWebApiResponse target, PermissionsType type) {
      target.Permissions.Add(type.ToString().ToLower());
    }

  }
}