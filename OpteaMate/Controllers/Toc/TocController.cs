// Copyright (c) 2020-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpteaMate.Web.Toc.Domain;
using Collares;

namespace OpteaMate.Web {
  using TocResponse = WebApiInfoResponse<object>;

  [Route("api/[controller]")]
  [ApiController]
  public class TocController : ControllerBase {
    
    private readonly ITocService _tocService;

    public TocController(ITocService tocService) {
      _tocService = tocService;
    }

    // GET: api/toc
    [HttpGet]
    [ProducesResponseType(typeof(TocResponse), StatusCodes.Status200OK)]
    public IActionResult GetToc() {
      var response = new TocResponse();
  
      var baseUrl = _tocService.GetBaseUrl();
      //var request = HttpContext.Request;
      //var baseUrl = string.Format("{ 0}://{1}{2}", request.Scheme, request.Host, request.PathBase);

      response.AddHref(OpteaMateHrefType.ROOT, baseUrl + "/api/");
      response.AddHref(OpteaMateHrefType.EVENTS, baseUrl + "/api/events/");
      response.AddHref(OpteaMateHrefType.OPTIMA, baseUrl + "/api/optima/");

      return Ok(response);
    }

  }
}
