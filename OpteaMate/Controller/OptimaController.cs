// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;

namespace opteamate
{

  [Route("api/[controller]")]
  [ApiController]
  public class OptimaController : ControllerBase {

    private readonly ILogger<OptimaController> _logger;
    private readonly OptimumData[] _optima = new OptimumData[] {
      new OptimumData {
        OptimumDboId = 1,
        Name = "Plausch-Liga",
        Strategies = "6-4-1;8-4-1;9-4-1;9-6-1",
        Positions = "Fwd;Back;Goal"
      },
      new OptimumData {
        OptimumDboId = 2,
        Name = "Plausch",
        Strategies = "10-1;12-1;13-1;15-1",
        Positions = "Feldspieler;Torhüter"
      },
      new OptimumData {
        OptimumDboId = 3,
        Name = "2xPlausch",
        Strategies = "18-2;20-2;24-2;26-2;30-2",
        Positions = "Feldspieler;Torhüter"
      },
      new OptimumData {
        OptimumDboId = 4,
        Name = "Date",
        Strategies = "1-1",
        Positions = "Frau;Mann"
      },
      new OptimumData {
        OptimumDboId = 5,
        Name = "Girls Night Out",
        Strategies = "3-0;*-0",
        Positions = "Frau;Mann"
      },
      new OptimumData {
        OptimumDboId = 6,
        Name = "GV",
        Strategies = "1-1-1-1-0;1-1-1-1-*",
        Positions = "Vorsitzender;Kassier;Stimmenzähler;Protokollführer;Beisitzer"
      }};

    public OptimaController(ILogger<OptimaController> logger) {
      _logger = logger;
    }

    // GET: api/optima
    [HttpGet]
    public IActionResult GetOptima() {
      var optimaDto = new OptimaDto();
      optimaDto.AddLink(LinkType.self, Url.ActionLink(nameof(GetOptima)));
      optimaDto.AddAction(ActionType.GET, "this");
      optimaDto.Data = new List<OptimumDto>();

      foreach (var optimum in _optima) {
        optimaDto.Data.Add(CreateOptimumDto(optimum));
      }
      return Ok(optimaDto);
    }

    // GET: api/optima/2
    [HttpGet("{id}")]
    public IActionResult GetOptimum(long id) {

      var optimum = _optima.First(o => o.OptimumDboId == id);
      if (optimum == null) { return NotFound(); }

      var optimaDto = CreateOptimumDto(optimum);
      return Ok(optimaDto);
    }

    private OptimumDto CreateOptimumDto(OptimumData data) {
      var optimaDto = new OptimumDto { Data = data };

      var linkOpt = Url.ActionLink(nameof(GetOptimum), null, new { id = data.OptimumDboId });
      optimaDto.AddLink(LinkType.self, linkOpt);
      optimaDto.AddAction(ActionType.GET, linkOpt);

      return optimaDto;
    }
  }
}
