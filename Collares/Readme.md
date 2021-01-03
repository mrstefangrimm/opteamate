# Collares

Collares is a Web API toolkit for ASP.NET Core to build a restful API with .NET/C#. 'Collares' stands for '**Coll**ections **a**nd **res**ouces'. This document describes the idea behind it.


The examples are taken from the project [OteaMate](https://github.com/mrstefangrimm/opteamate), which has a open [API](https://opteamate.dynv6.net/swagger/index.html) and is open source.



Is Collares for you? 

Collares is for Hobbyist and small projects. 




## Web API Response Types

By definition, the response of a Web API should not change its form. With Collares, the response types 'Collection' and 'Info' have a sealed form whereas the type 'Resource' is extendable.

| Property |  |
| --- | -----|
| Type | is always either 'Collection', 'Resource' or 'Info'. |
| Hrefs | is a dictionary of possible actions. |
| Id | is the unique resource id. |
| Data | is the payload respectively  a value object. |



![Logic-Composite](.\Logic-Composite.jpg)





Web API Response Types and Data Payload Objects

### Type Resource Response
A resource has a unique Id. A resource can be directly accessed and patched or deleted.

#### Example
Return the shopping list with Id "4".
Note that the Data is not the items collection but a value object describing the shopping list.

Query: `GET http://../shoppinglists/4`
Output:

```
{ "Type":"Resource",
  "Id":4,
  "Data":
  { "Shopper":"S. Hopper",
    "CreationTime":"2021-01-03T15:59:57.9366648+01:00"
  },
  "Hrefs":{"delete":"/api/shoppinglists/4"},
  "Items":
  { "Type":"Collection",
    "Data":
    [
      { "Type":"Resource",
        "Id":1,
        "Data":{"Product":"apples","Price":3.49},
        "Hrefs":{}
      }, 
      { "Type":"Resource",
        "Id":2,
        "Data":{"Product":"pears","Price":2.99},
        "Hrefs":{}
      }
    ],
    "Hrefs":{}
  }  
}
```


### Type Collection Response

A collection hasn't an Id. Data is a collection of Resource-Responses.

#### Example
Return all the items of the shopping list with Id "4".

Query: `GET http://../shoppinglists/4/items`
Output:

```
{ "Type":"Collection",
  "Data":
  [
    { "Type":"Resource",
      "Id":1,
      "Data":{"Product":"apples","Price":3.49},
      "Hrefs":{"delete":"/api/shoppinglists/4/items/1"}
    },
    { "Type":"Resource",
      "Id":2,
      "Data":{"Product":"pears","Price":2.99},
      "Hrefs":{"delete":"/api/shoppinglists/4/items/2"}
    }
  ],
  "Hrefs":{"post":"/api/shoppinglists/4/items"}
}
```

### Type Info Response

An info response hasn't an Id. Data is a value object. The href "post" of the info object indicates that items can be added.

#### Example 1
Return the info with the total price of the shopping list with Id "4".

Query: `GET http://../shoppinglists/4/items/info`
Output:
```
{ "Type":"Info",
  "Data":
  { "TotalPrice":6.48,
    "AvgPrice":3.24
  },
  "Hrefs":{}

}
```

#### Example 2
Return the information if shopping list can be added. 
The query `GET http://../shoppinglists` would return the whole Database. The solution is an info response that  just returns the information you need:

Query: `GET http://../shoppinglists/info`
Output:
```
{ "Type":"Info",
  "Data":{},
  "Hrefs":{"post":"/api/shoppinglists/info"}
}
```
