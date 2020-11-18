// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace opteamate {

  [Route("api/[controller]")]
  [ApiController]
  public class EventsController : ControllerBase {
    private readonly OpteaMateContext _context;

    public EventsController(OpteaMateContext context) {
      _context = context;
    }

    /// <remarks>
    /// Sample request:
    /// 
    ///     GET api/events/info
    ///     {      
    ///         "type": "Collection"
    ///         "data" : null
    ///         "hrefs":
    ///         {
    ///             "post": api/events
    ///         }
    ///     }
    /// </remarks>
    [HttpGet("info")]
    [ProducesResponseType(typeof(EventsInfoResponse), StatusCodes.Status200OK)]
    public IActionResult GetEventsInfo() {

      var response = new EventsInfoResponse();

      // PostEvent
      response.AddHref(HrefType.POST, "api/events");
      return Ok(response);
    }

    // GET: api/events
    [HttpGet]
    [ProducesResponseType(typeof(EventsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(StatusCodeResult), StatusCodes.Status401Unauthorized)]
    public IActionResult GetEvents() {

      var headers = HttpContext.Request.Headers["user"];
      bool isAdmin = headers.Contains("admin");

      if (isAdmin) {
        var response = new EventsResponse();

        var evtsDbo = _context.Events.ToList();
        if (evtsDbo.Count > 0) {
          // Do not load registration to reduce network traffic _context.Registrations.Load();

          response.Data = new List<EventResponse>();

          foreach (var evtDbo in evtsDbo) {
            response.Data.Add(CreateEventResponse(evtDbo));
          }
        }
        // PostEvent
        response.AddHref(HrefType.POST, "api/events");

        return Ok(response);
      }
      
      return Unauthorized();    
    }

    //GET "http://localhost:5000/api/events/bytoken?key=event&token=0000-abcd"
    [HttpGet("byToken")]
    [ProducesResponseType(typeof(EventsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(StatusCodeResult), StatusCodes.Status404NotFound)]
    public IActionResult GetEvents(string key, Guid token) {

      Func<EventDbo, bool> comp = null;
      if (key == "event") { comp = a => a.EventToken == token; }
      else if (key == "series") { comp = a => a.SeriesToken == token; }
      if (comp != null) {
        var response = new EventsResponse { Data = new List<EventResponse>() };

        var matches = _context.Events.Where(comp);
        foreach (EventDbo evtDbo in matches) {
          var evtDto = CreateEventResponse(evtDbo);
          response.Data.Add(evtDto);
        }

        // PostEvent
        response.AddHref(HrefType.POST, "api/events");

        return Ok(response);
      }
      return NotFound();
    }

    //GET "http://localhost:5000/api/events/byevent?token=0000-abcd"
    [HttpGet("byEvent")]
    [ProducesResponseType(typeof(EventsResponse), StatusCodes.Status200OK)]
    public IActionResult GetEventsByEventToken(Guid token) {
      var response = new EventsResponse();

      var matches = _context.Events.Where(a => a.EventToken == token);
      if (matches.Any()) {
        response.Data = new List<EventResponse>();
        foreach (EventDbo evtDbo in matches) {
          var evtDto = CreateEventResponse(evtDbo);
          response.Data.Add(evtDto);
        }
      }

      // PostEvent
      response.AddHref(HrefType.POST, "api/events");

      return Ok(response);
    }

    //GET "http://localhost:5000/api/events/byseries?token=0000-abcd"
    [HttpGet("bySeries")]
    [ProducesResponseType(typeof(EventsResponse), StatusCodes.Status200OK)]
    public IActionResult GetEventsBySeriesToken(Guid token) {
      var response = new EventsResponse();

      var matches = _context.Events.Where(a => a.SeriesToken == token);
      if (matches.Any()) {
        response.Data = new List<EventResponse>();

        foreach (EventDbo evtDbo in matches) {
          var evtDto = CreateEventResponse(evtDbo);
          response.Data.Add(evtDto);
        }
      }

      // PostEvent
      response.AddHref(HrefType.POST, "api/events");

      return Ok(response);
    }

    // GET: api/events/5/registrations/info
    [HttpGet("{id}/registrations/info")]
    [ProducesResponseType(typeof(RegistrationsInfoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(StatusCodeResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetEventRegistrationsInfo(long id) {

      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }

      var response = new RegistrationsInfoResponse() {
        Data = new RegistrationsInfoData()
      };

      var loadingTask = _context.Entry(evtDbo).Collection(e => e.Registrations).LoadAsync();

      bool mutable = evtDbo.Deadline.HasValue ? evtDbo.Deadline > DateTime.Now.ToUniversalTime() : evtDbo.Start > DateTime.Now.ToUniversalTime();
      if (mutable) {
        // PostEventRegistration
        response.AddHref(HrefType.POST, $"api/events/{id}/registrations");
      }

      await loadingTask;
      int numReg = evtDbo.Registrations.Count();
      int numSponsors = evtDbo.Registrations.Count(r => !string.IsNullOrEmpty(r.SponsorOf));

      response.Data.NumRegistrations = numReg;
      response.Data.HasSponsors = numSponsors != 0;

      return Ok(response);
    }

    // GET: api/events/5
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(EventResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(StatusCodeResult), StatusCodes.Status404NotFound)]
    public IActionResult GetEvent(long id) {
      // Not sure if async is makes a difference:
      // https://stackoverflow.com/questions/30042791/entity-framework-savechanges-vs-savechangesasync-and-find-vs-findasync
      // And have you ever seen how many threads are available in a typical ASP.Net server? It's like tens of thousands
      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }

      // https://stackoverflow.com/questions/31047247/query-with-loadasync-does-not-return-an-entity-although-it-should
      _context.Entry(evtDbo).Collection(e => e.Registrations).Load();

      var evtDto = CreateEventResponse(evtDbo);
      return Ok(evtDto);
    }

    /// <remarks>
    /// Sample request:
    /// 
    ///     POST api/events
    ///     {        
    ///         "title": "practice session",
    ///         "location": "ice rink #2",
    ///         "start": "2020-11-02T21:15",
    ///         "optimumId": 1
    ///     }
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(EventResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> PostEvent(EventData evt) {

      var evtDbo = new EventDbo();
      evtDbo.CopyFrom(evt);
      evtDbo.EventToken = Guid.NewGuid();
      _context.Events.Add(evtDbo);

      var saving = _context.SaveChangesAsync();
      EventResponse evtDto = CreateEventResponse(evtDbo);
      await saving; 

      return CreatedAtAction(nameof(GetEvent), new { evtDbo.EventDboId }, evtDto);
    }

    // POST: api/events/1/registrations
    [HttpPost("{id}/registrations")]
    [ProducesResponseType(typeof(EventResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(StatusCodeResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> PostEventRegistration(long id, RegistrationData reg) {

      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }

      _context.Entry(evtDbo).Collection(e => e.Registrations).Load();

      if (evtDbo.Registrations == null) { evtDbo.Registrations = new List<RegistrationDbo>(); }
      var regDbo = new RegistrationDbo();
      evtDbo.Registrations.Add(regDbo);
      regDbo.CopyFrom(reg);

      _context.Update(evtDbo);
      var saving = _context.SaveChangesAsync();
      var evtDto = CreateEventResponse(evtDbo);
      await saving;

      return CreatedAtAction(nameof(GetEvent), new { evtDbo.EventDboId }, evtDto);
    }

    // PATCH: api/events/5
    [HttpPatch("{id}")]
    [ProducesResponseType(typeof(EventResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(StatusCodeResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> PatchEvent(long id, EventData evt) {

      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }

      _context.Entry(evtDbo).Collection(e => e.Registrations).Load();

      evtDbo.Start = evt.Start;
      evtDbo.Title = evt.Title;
      evtDbo.Location = evt.Location;
      _context.Entry(evtDbo).State = EntityState.Modified;

      try {
        var saving = _context.SaveChangesAsync();
        var evtDto = CreateEventResponse(evtDbo);
        await saving;
        return Ok(evtDto);
      }
      catch (DbUpdateConcurrencyException) {
        if (!_context.Events.Any(e => e.EventDboId == id)) {
          return NotFound();
        }
        else {
          throw;
        }
      }
    }

    // PATCH: api/events/5/registrations/1
    [HttpPatch("{id}/registrations/{regid}")]
    [ProducesResponseType(typeof(EventResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(StatusCodeResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> PatchEventRegistration(long id, long regid, RegistrationData reg) {

      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }

      var regDbo = _context.Registrations.Find(regid);
      if (regDbo == null) { return NotFound(); }
      regDbo.Name = reg.Name;
      regDbo.SponsorOf = reg.SponsorOf;
      _context.Entry(regDbo).State = EntityState.Modified;

      _context.Entry(evtDbo).Collection(e => e.Registrations).Load();

      try {
        var saving = _context.SaveChangesAsync();
        var evtDto = CreateEventResponse(evtDbo);
        await saving;
        return Ok(evtDto);
      }
      catch (DbUpdateConcurrencyException) {
        if (!_context.Registrations.Any(e => e.RegistrationDboId == id)) {
          return NotFound();
        }
        else {
          throw;
        }
      }      
    }

    // DELETE: api/events/5
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(StatusCodeResult), StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(StatusCodeResult), StatusCodes.Status404NotFound)]
    public IActionResult DeleteEvent(long id) {

      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }

      _context.Events.Remove(evtDbo);

      _context.Entry(evtDbo).Collection(e => e.Registrations).Load();
      if (evtDbo.Registrations != null) {
        _context.Registrations.RemoveRange(evtDbo.Registrations.ToArray());
      }

      _context.SaveChanges();
      return NoContent();
    }

    // DELETE: api/events/5/registrations/4
    [HttpDelete("{id}/registrations/{regid}")]
    [ProducesResponseType(typeof(StatusCodeResult), StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(StatusCodeResult), StatusCodes.Status404NotFound)]
    public IActionResult DeleteEventRegistration(long id, long regid) {

      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }

      var regDbo = _context.Registrations.Find(regid);
      if (regDbo == null) { return NotFound(); }

      _context.Registrations.Remove(regDbo);
      evtDbo.Registrations.Remove(regDbo);

      _context.Update(evtDbo);

      _context.SaveChanges();
      return NoContent();
    }

    private EventResponse CreateEventResponse(EventDbo dbo) {
      var response = new EventResponse() {
        Id = dbo.EventDboId,
        Data = new EventData(),
        Registrations = new RegistrationsResponse() { Data = new List<RegistrationResponse>() }
      };

      response.Data.CopyFrom(dbo);
      
      bool mutable = dbo.Deadline.HasValue ? dbo.Deadline > DateTime.Now.ToUniversalTime() : dbo.Start > DateTime.Now.ToUniversalTime();
      if (dbo.Registrations != null) {
        foreach (var regDbo in dbo.Registrations) {
          response.Registrations.Data.Add(CreateRegistrationResponse(regDbo, mutable));
        }
      }

      response.AddHref(HrefType.SELF, "enroll/" + dbo.EventToken);
      if (dbo.SeriesToken.HasValue && dbo.SeriesToken != Guid.Empty) {
        response.AddHref(HrefType.BACK, "series/" + dbo.SeriesToken);
      }
      // DeleteEvent; also possible to delete past events
      response.AddHref(HrefType.DELETE, $"api/events/{dbo.EventDboId}");

      if (mutable) {
        // PostEventRegistration
        response.Registrations.AddHref(HrefType.POST, $"api/events/{dbo.EventDboId}/registrations");
      }
      return response;
    }

    private RegistrationResponse CreateRegistrationResponse(RegistrationDbo dbo, bool mutable) {
      var response = new RegistrationResponse { Id = dbo.RegistrationDboId, Data = new RegistrationData() };
      response.Data.CopyFrom(dbo);
      if (mutable) {
        response.AddHref(HrefType.DELETE, $"api/events/{dbo.EventDboId}/registrations/{dbo.RegistrationDboId}");
      }
      return response;
    }

  }
}