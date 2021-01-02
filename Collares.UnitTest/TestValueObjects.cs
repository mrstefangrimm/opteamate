// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

namespace Collares.UnitTest.TestModel {

  class ShoppingItem {
    public string Product { get; set; }
    public decimal Price { get; set; }
  }

  class ShoppingList {
    public string Owner { get; set; }
  }

  class ShoppingListItemsInfo {
    public decimal AvgPrice { get; set; }
  }
}
