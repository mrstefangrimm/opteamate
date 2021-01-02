// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Collares.Base;
using Collares.UnitTest.TestModel;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Text.Json;


namespace Collares.UnitTest.Info {
  using InfoResponseRecommendedWithoutData = WebApiInfoResponse<object>;
  using ShoppingListItemsInfoResponse = WebApiInfoResponse<ShoppingListItemsInfo>;

  class InfoResponseNotRecommended : WebApiInfoResponseBase<ShoppingListItemsInfo> {
  }
  class InfoResponseNotRecommendedWithoutData : WebApiInfoResponseBase<object> {
  }
  
  [TestClass]
  public class WebApiInfoTest {
    [TestMethod]
    public void TestMethod1() {

      var resp1 = new ShoppingListItemsInfoResponse();
      resp1.Data.AvgPrice = 6.48m;
      resp1.AddHref(HrefType.GET, "/api/shoppinglists/1/info");

      var resp2 = new InfoResponseRecommendedWithoutData();
      resp2.AddHref(HrefType.GET, "/api/shoppinglists/1/info");

      var resp3 = new InfoResponseNotRecommended() {
        Data = new ShoppingListItemsInfo { AvgPrice = 6.48m }
      };
      resp3.AddHref(HrefType.GET, "/api/shoppinglists/1/info");

      var resp4 = new InfoResponseNotRecommendedWithoutData();
      resp4.AddHref(HrefType.GET, "/api/shoppinglists/1/info");

      string jsonResp1 = JsonSerializer.Serialize(resp1);
      string jsonResp2 = JsonSerializer.Serialize(resp2);
      string jsonResp3 = JsonSerializer.Serialize(resp3);
      string jsonResp4 = JsonSerializer.Serialize(resp4);

      var desResp1 = JsonSerializer.Deserialize<ShoppingListItemsInfoResponse>(jsonResp1);
      var desResp2 = JsonSerializer.Deserialize<InfoResponseRecommendedWithoutData>(jsonResp2);
      var desResp3 = JsonSerializer.Deserialize<InfoResponseNotRecommended>(jsonResp3);
      var desResp4 = JsonSerializer.Deserialize<InfoResponseNotRecommendedWithoutData>(jsonResp4);

      Assert.AreEqual(6.48m, desResp1.Data.AvgPrice);
      Assert.IsNotNull(desResp2.Data);
      Assert.AreEqual(6.48m, desResp3.Data.AvgPrice);
      Assert.IsNull(desResp4.Data);

      Assert.AreEqual("/api/shoppinglists/1/info", desResp1.Hrefs["get"]);
      Assert.AreEqual("/api/shoppinglists/1/info", desResp2.Hrefs["get"]);
      Assert.AreEqual("/api/shoppinglists/1/info", desResp3.Hrefs["get"]);
      Assert.AreEqual("/api/shoppinglists/1/info", desResp4.Hrefs["get"]);

    }
  }
}
