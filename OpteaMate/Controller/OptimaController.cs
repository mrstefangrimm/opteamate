﻿// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;

namespace opteamate {

  [Route("api/[controller]")]
  [ApiController]
  public class OptimaController : ControllerBase {

    private readonly OpteaMateContext _context;
    private readonly ILogger<OptimaController> _logger;

    public OptimaController(OpteaMateContext context, ILogger<OptimaController> logger) {
      _context = context;
      _logger = logger;
    }

    // GET: api/optima
    [HttpGet]
    public IActionResult GetOptima() {
      var response = new OptimaResponse();

      var dbo = _context.Optima.ToList();
      if (dbo.Count > 0) {

        response.Data = new List<OptimumResponse>();

        foreach (var optimum in dbo) {
          response.Data.Add(CreateOptimumResponse(optimum));
        }
      }      
      return Ok(response);
    }

    // GET: api/optima/2
    [HttpGet("{id}")]
    public IActionResult GetOptimum(long id) {

      var optimum = _context.Optima.First(o => o.OptimumDboId == id);
      if (optimum == null) { return NotFound(); }

      var response = CreateOptimumResponse(optimum);
      return Ok(response);
    }
    
    private OptimumResponse CreateOptimumResponse(OptimumDbo dbo) {
      var response = new OptimumResponse { Id = dbo.OptimumDboId, Data = new OptimumData() };
      response.Data.CopyFrom(dbo);

      var linkOpt = Url.ActionLink(nameof(GetOptimum), null, new { dbo.OptimumDboId });
      response.AddPermission(PermissionsType.GET);

      return response;
    }
  }
}
