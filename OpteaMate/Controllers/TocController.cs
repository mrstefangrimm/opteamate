// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace opteamate {

  [Route("api/[controller]")]
  [ApiController]
  public class TocController : ControllerBase {

    public TocController() {
    }

    // GET: api/toc
    [HttpGet]
    [ProducesResponseType(typeof(TocResponse), StatusCodes.Status200OK)]
    public IActionResult GetToc() {
      var response = new TocResponse();
  
      var request = HttpContext.Request;
      var baseUrl = string.Format("{0}://{1}{2}", request.Scheme, request.Host, request.PathBase);

      response.AddHref(HrefType.ROOT, baseUrl + "/api/");
      response.AddHref(HrefType.EVENTS, baseUrl + "/api/events/");
      response.AddHref(HrefType.OPTIMA, baseUrl + "/api/optima/");

      return Ok(response);
    }

  }
}
