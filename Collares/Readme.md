# Collares

Collares is a web api toolkit.
Collares is a bunch of classes to build a restful API with .NET/C#. 'Collares' stands for '**Coll**ections **a**nd **res**ouces'. This document describes the idea behind this.

The examples are taken from the project [OteaMate](https://github.com/mrstefangrimm/opteamate), which has a open [API](https://opteamate.dynv6.net/swagger/index.html) and is open source.




## Web API Responses and Data Payload Objects

The response of a Web API should not change its form. With Collares, the response has a 'Type' and 'Hrefs', an 'Id' and 'Data' if it is a 'Resource'.

| Property |  |
| --- | -----|
| Type | is always either 'Collection' or 'Resource'. |
| Hrefs | is a dictionary of possible actions. |
| Id | is the unique resource id. |
| Data | is either the payload of a resource or a collection. |

Note that for a restful API, it is not required to have a specific form or is limited to the properties listed above. With Collares, a 'Type' and 'Hrefs' are always present.







