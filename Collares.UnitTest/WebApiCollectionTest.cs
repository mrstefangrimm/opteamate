// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Collares.Base;
using Collares.UnitTest.TestModel;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace Collares.UnitTest.Collection {
  using ShoppingListItemsResponse = WebApiCollectionResponse<ShoppingItemResponse, ShoppingItem>;
  class ShoppingItemResponse : WebApiResourceResponse<ShoppingItem> {
  }
  class CollectionResponseNotRecommended : WebApiCollectionResponseBase<ShoppingItemResponse, ShoppingItem> {
  }
  class CollectionResponseTestWrong : WebApiCollectionResponseBase<ShoppingItem, ShoppingItem> {
  }

  [TestClass]
  public class WebApiCollectionTest {

    [TestMethod]
    public void TestMethod1() {

      var payload1 = new ShoppingItemResponse() {
        Id = 1
      };
      payload1.Data.Product = "apples";

      var payload2 = new ShoppingItemResponse() {
        Id = 2
      };
      payload2.Data.Product = "pears";


      var resp1 = new ShoppingListItemsResponse();
      resp1.Data.Add(payload1);
      resp1.Data.Add(payload2);
      resp1.AddHref(HrefType.POST, "/api/shoppinglists");

      var resp2 = new CollectionResponseNotRecommended();
      resp2.Data = new List<ShoppingItemResponse>();
      resp2.Data.Add(payload1);
      resp2.Data.Add(payload2);
      resp2.AddHref(HrefType.POST, "/api/shoppinglists");

      var resp3 = new CollectionResponseTestWrong();
      //resp3.Data.Add(payload1);
      //resp3.Data.Add(payload2);
      resp3.AddHref(HrefType.POST, "/api/shoppinglists/");

      string jsonResp1 = JsonSerializer.Serialize(resp1);
      string jsonResp2 = JsonSerializer.Serialize(resp2);

      var desResp1 = JsonSerializer.Deserialize<ShoppingListItemsResponse>(jsonResp1);
      var desResp2 = JsonSerializer.Deserialize<CollectionResponseNotRecommended>(jsonResp2);

      Assert.AreEqual(2, desResp1.Data.Count);
      Assert.AreEqual(2, desResp2.Data.Count);
      
      Assert.AreEqual("apples", desResp1.Data.First().Data.Product);
      Assert.AreEqual("apples", desResp2.Data.First().Data.Product);
      Assert.AreEqual("pears", desResp1.Data.Last().Data.Product);
      Assert.AreEqual("pears", desResp2.Data.Last().Data.Product);

      Assert.AreEqual("/api/shoppinglists", desResp1.Hrefs["post"]);
      Assert.AreEqual("/api/shoppinglists", desResp2.Hrefs["post"]);
    }
  }
}
