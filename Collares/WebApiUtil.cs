// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Collares.Base;

namespace Collares {

  public enum WebApiResponseType {
    Resource,
    Collection,
    Info
  }

  public enum GenericHrefType {
    SELF,
    GET,
    POST,
    PUT,
    PATCH,
    DELETE
  }
  
  public class HrefType {
    public static Val2Type<GenericHrefType> SELF = new Val2Type<GenericHrefType>(GenericHrefType.SELF);
    public static Val2Type<GenericHrefType> GET = new Val2Type<GenericHrefType>(GenericHrefType.GET);
    public static Val2Type<GenericHrefType> POST = new Val2Type<GenericHrefType>(GenericHrefType.POST);
    public static Val2Type<GenericHrefType> PUT = new Val2Type<GenericHrefType>(GenericHrefType.PUT);
    public static Val2Type<GenericHrefType> PATCH = new Val2Type<GenericHrefType>(GenericHrefType.PATCH);
    public static Val2Type<GenericHrefType> DELETE = new Val2Type<GenericHrefType>(GenericHrefType.DELETE);
  }

  public static class WebApiUtil {
    public static void AddHref<THREF>(this WebApiResponse target, Val2Type<THREF> type, string value) {
      target.Hrefs.Add(type.ToString().ToLower(), value?.ToLower());
    }
  }

  public class Val2Type<T> {
    public Val2Type(T val) {
      Val = val;
    }
    public override string ToString() {
      return Val.ToString();
    }
    public T Val { get; }
  }

}