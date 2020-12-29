// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OpteaMate.Domain;
using OpteaMate.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;

namespace OpteaMate.Web {

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
    [ProducesResponseType(typeof(OptimaResponse), StatusCodes.Status200OK)]
    public IActionResult GetOptima() {
      var response = new OptimaResponse();

      var dbo = _context.Optima.Where(x => x.Public).ToList();
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
    [ProducesResponseType(typeof(OptimumResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(StatusCodeResult), StatusCodes.Status404NotFound)]
    public IActionResult GetOptimum(long id) {

      var optimum = _context.Optima.First(o => o.OptimumDboId == id);
      if (optimum == null) { return NotFound(); }

      var response = CreateOptimumResponse(optimum);
      return Ok(response);
    }

    //GET "http://localhost:5000/api/optima/byseries?token=0000-abcd"
    [HttpGet("bySeries")]
    [ProducesResponseType(typeof(EventsResponse), StatusCodes.Status200OK)]
    public IActionResult GetOptimaBySeriesToken(Guid token) {
      var response = new OptimaResponse();

      var dbo = _context.Optima.Where(x => x.Public || x.SeriesToken == token).ToList();
      if (dbo.Count > 0) {

        response.Data = new List<OptimumResponse>();

        foreach (var optimum in dbo) {
          response.Data.Add(CreateOptimumResponse(optimum));
        }
      }
      return Ok(response);
    }

    [HttpPost]
    [ProducesResponseType(typeof(OptimumResponse), StatusCodes.Status200OK)]
    public IActionResult PostOptimum(OptimumData data) {

      var optDbo = new OptimumDbo();
      optDbo.CopyFrom(data);

      using (var dbContextTransaction = _context.Database.BeginTransaction()) {
        _context.Optima.Add(optDbo);

        _context.SaveChanges();
        dbContextTransaction.Commit();
      }

      OptimumResponse optDto = CreateOptimumResponse(optDbo);
      return CreatedAtAction(nameof(GetOptimum), new { optDbo.OptimumDboId }, optDto);
    }

    private OptimumResponse CreateOptimumResponse(OptimumDbo dbo) {
      var response = new OptimumResponse { Id = dbo.OptimumDboId, Data = new OptimumData() };
      response.Data.CopyFrom(dbo);

      var linkOpt = Url.ActionLink(nameof(GetOptimum), null, new { dbo.OptimumDboId });

      return response;
    }
  }
}
