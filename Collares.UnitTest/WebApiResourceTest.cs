// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Collares.Base;
using Collares.UnitTest.TestModel;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace Collares.UnitTest.Resource {
  using ResourceResponseNotRecommended = WebApiResourceResponseBase<ShoppingList>;
  using ShoppingListItems = WebApiCollectionResponse<ShoppingItemResponse, ShoppingItem>;
  class ShoppingItemResponse : WebApiResourceResponse<ShoppingItem> {
  }
  class ShoppingListResponse : WebApiResourceResponse<ShoppingList> {
    public ShoppingListItems Items { get; set; } = new ShoppingListItems();
  }
  class ResourceResponseNotRecommended2 : WebApiResourceResponseBase<ShoppingList> {
    public ShoppingListItems Items { get; set; }
  }
  class ResourceResponseWrong : WebApiResourceResponseBase<string> {
    public ICollection<ShoppingItem> Items { get; set; }
  }

  [TestClass]
  public class WebApiResourceTest {
    [TestMethod]
    public void TestMethod1() {
      var item1 = new ShoppingItem { Product = "apples", Price = 3.49m };
      var item2 = new ShoppingItem { Product = "pears", Price = 2.99m };
      var item1Response = new ShoppingItemResponse { Id = 1, Data = item1 };
      var item2Response = new ShoppingItemResponse { Id = 2, Data = item2 };

      var resp1 = new ResourceResponseNotRecommended() { 
        Id = 1,
        Data = new ShoppingList() { Owner = "TheOwner" }
      };
      //resp1.Items.

      var resp2 = new ShoppingListResponse();
      resp2.Id = 2;
      resp2.Data.Owner = "TheOwner";
      resp2.Items.Data.Add(item1Response);
      resp2.Items.Data.Add(item2Response);

      var resp3 = new ResourceResponseNotRecommended2() {
        Id = 3,
        Data = new ShoppingList() { Owner = "TheOwner" },
        Items = new ShoppingListItems()
      };
      resp3.Items.Data.Add(item1Response);
      resp3.Items.Data.Add(item2Response);

      var resp4 = new ResourceResponseWrong() {
        Id = 3,
        Data = "TheOwner",
        Items = new List<ShoppingItem>()
      };
      resp4.Items.Add(item1);
      resp4.Items.Add(item2);

      string jsonResp1 = JsonSerializer.Serialize(resp1);
      string jsonResp2 = JsonSerializer.Serialize(resp2);
      string jsonResp3 = JsonSerializer.Serialize(resp3);

      var desResp1 = JsonSerializer.Deserialize<ResourceResponseNotRecommended>(jsonResp1);
      var desResp2 = JsonSerializer.Deserialize<ShoppingListResponse>(jsonResp2);
      var desResp3 = JsonSerializer.Deserialize<ResourceResponseNotRecommended2>(jsonResp3);

      Assert.AreEqual("TheOwner", desResp1.Data.Owner);
      Assert.AreEqual("TheOwner", desResp2.Data.Owner);
      Assert.AreEqual("TheOwner", desResp3.Data.Owner);
      Assert.AreEqual("apples", desResp2.Items.Data.First().Data.Product);
      Assert.AreEqual("apples", desResp3.Items.Data.First().Data.Product);
      Assert.AreEqual("pears", desResp2.Items.Data.Last().Data.Product);
      Assert.AreEqual("pears", desResp3.Items.Data.Last().Data.Product);

    }
  }
}
