// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace opteamate
{

  [Route("api/[controller]")]
  [ApiController]
  public class EventsController : ControllerBase {
    private readonly OpteaMateContext _context;

    public EventsController(OpteaMateContext context) {
      _context = context;
    }

    // GET: api/events
    [HttpGet]
    public IActionResult GetEvents() {

      var evtsDbo = _context.Events.ToList();

      var eventsDto = new EventsDto();
      eventsDto.AddLink(LinkType.self, Url.ActionLink(nameof(GetEvents)));
      eventsDto.AddAction(ActionType.GET, "this");

      if (evtsDbo.Count > 0) {
        // Do not load registration to reduce network traffic _context.Registrations.Load();

        eventsDto.Data = new List<EventDto>();

        foreach (var evtDbo in evtsDbo) {
          var evtDto = CreateEventDto(evtDbo);
          eventsDto.Data.Add(evtDto);
        }
      }
      return Ok(eventsDto);
    }

    // GET: api/events/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetEvent(long id) {
      // Not sure if async is makes a difference:
      // https://stackoverflow.com/questions/30042791/entity-framework-savechanges-vs-savechangesasync-and-find-vs-findasync
      // And have you ever seen how many threads are available in a typical ASP.Net server? It's like tens of thousands
      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }

      await _context.Registrations.LoadAsync();
      var evtDto = CreateEventDto(evtDbo);
      return Ok(evtDto);
    }

    //GET "http://localhost:5000/api/events/bytoken?key=event&token=0000-abcd"
    [HttpGet("byToken")]
    public IActionResult GetEvents(string key, Guid token) {

      Func<EventDbo, bool> comp = null;
      if (key == "event") { comp = a => a.EventToken == token; }
      else if (key == "series") { comp = a => a.SeriesToken == token; }
      if (comp != null) {
        var eventsDto = new EventsDto();
        eventsDto.Data = new List<EventDto>();

        var linkEvt = Url.ActionLink(@"api/bytoken", null, new { key = key, token = token });

        eventsDto.AddLink(LinkType.self, linkEvt);

        var matches = _context.Events.Where(comp);
        foreach (EventDbo evtDbo in matches) {
          var evtDto = CreateEventDto(evtDbo);
          eventsDto.Data.Add(evtDto);
        }
        return Ok(eventsDto);
      }      
      return NoContent();
    }

    //GET "http://localhost:5000/api/events/byevent?token=0000-abcd"
    [HttpGet("byEvent")]
    public IActionResult GetEventsByEventToken(Guid token) {
      var eventsDto = new EventsDto();
      eventsDto.Data = new List<EventDto>();

      var linkEvt = Url.ActionLink(nameof(GetEventsByEventToken), null, new { token = token });
      eventsDto.AddLink(LinkType.self, linkEvt);

      var matches = _context.Events.Where(a => a.EventToken == token);
      if (matches.Any())
      {
        _context.Registrations.Load();
        foreach (EventDbo evtDbo in matches)
        {
          var evtDto = CreateEventDto(evtDbo);
          eventsDto.Data.Add(evtDto);
        }
      }
      return Ok(eventsDto);
    }

    //GET "http://localhost:5000/api/events/byseries?token=0000-abcd"
    [HttpGet("bySeries")]
    public IActionResult GetEventsBySeriesToken(Guid token) {
      var eventsDto = new EventsDto();
      eventsDto.Data = new List<EventDto>();

      var linkEvt = Url.ActionLink(nameof(GetEventsBySeriesToken), null, new { token = token });
      eventsDto.AddLink(LinkType.self, linkEvt);

      var matches = _context.Events.Where(a => a.SeriesToken == token);
      foreach (EventDbo evtDbo in matches) {
        var evtDto = CreateEventDto(evtDbo);
        eventsDto.Data.Add(evtDto);
      }
      return Ok(eventsDto);
    }

    [HttpPost]
    public async Task<IActionResult> PostEvent(EventData evt) {

      var evtDbo = new EventDbo();
      evt.EventToken = Guid.NewGuid();
      evtDbo.CopyFrom(evt);
      _context.Events.Add(evtDbo);

      var saving = _context.SaveChangesAsync();
      EventDto evtDto = CreateEventDto(evtDbo);
      await saving; 

      return CreatedAtAction(nameof(GetEvent), new { id = evtDbo.EventDboId }, evtDto);
    }

    // POST: api/events/1/registrations
    [HttpPost("{id}/registrations")]
    public async Task<IActionResult> PostEventRegistration(long id, RegistrationData reg) {

      var finding = _context.Events.FindAsync(id);
      var loading = _context.Registrations.LoadAsync();

      var evtDbo = await finding;
      if (evtDbo == null) { return NotFound(); }
      await loading;

      if (evtDbo.Registrations == null) { evtDbo.Registrations = new List<RegistrationDbo>(); }
      var regDbo = new RegistrationDbo();
      evtDbo.Registrations.Add(regDbo);
      regDbo.CopyFrom(reg);

      _context.Update(evtDbo);
      var saving = _context.SaveChangesAsync();
      var evtDto = CreateEventDto(evtDbo);
      await saving;

      return CreatedAtAction(nameof(GetEvent), new { id = evtDbo.EventDboId }, evtDto);
    }

    // PUT: api/events/5
    [HttpPut("{id}")]
    public IActionResult PutEvent(long id, EventData evt) {

      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }

      evtDbo.CopyFrom(evt);
      _context.Entry(evtDbo).State = EntityState.Modified;

      try {
        _context.SaveChanges();
      }
      catch (DbUpdateConcurrencyException) {
        if (!_context.Events.Any(e => e.EventDboId == id)) {
          return NotFound();
        }
        else {
          throw;
        }
      }
      return NoContent();
    }

    // PUT: api/events/5/registrations/1
    [HttpPut("{id}/registration/{regid}")]
    public IActionResult PutEventRegistration(long id, long regid, RegistrationData reg) {

      if (!_context.Events.Any(e => e.EventDboId == id)) { return NotFound(); }

      var regDbo = _context.Registrations.Find(regid);
      if (regDbo == null) { return NotFound(); }
      regDbo.CopyFrom(reg);
      _context.Entry(regDbo).State = EntityState.Modified;

      try {
        _context.SaveChanges();
      }
      catch (DbUpdateConcurrencyException) {
        if (!_context.Registrations.Any(e => e.RegistrationDboId == id)) {
          return NotFound();
        }
        else {
          throw;
        }
      }

      return NoContent();
    }

    // DELETE: api/events/5
    [HttpDelete("{id}")]
    public IActionResult DeleteEvent(long id) {

      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }

      _context.Events.Remove(evtDbo);

      _context.Registrations.Load();
      if (evtDbo.Registrations != null) {
        _context.Registrations.RemoveRange(evtDbo.Registrations.ToArray());
      }
      
      _context.SaveChanges();
      return NoContent();
    }

    // DELETE: api/events/5/registrations/4
    [HttpDelete("{id}/registrations/{regid}")]
    public async Task<IActionResult> DeleteEventRegistration(long id, long regid) {

      var findingEvt = _context.Events.FindAsync(id);
      var findingReg = _context.Registrations.FindAsync(regid);

      var regDbo = await findingReg;
      if (regDbo == null) { return NotFound(); }
      _context.Registrations.Remove(regDbo);

      var evtDbo = await findingEvt;
      if (evtDbo == null) { return NotFound(); }
      evtDbo.Registrations.Remove(regDbo);

      _context.Update(evtDbo);

      _context.SaveChanges();
      return NoContent();
    }

    private EventDto CreateEventDto(EventDbo evtDbo) {
      var evtDto = new EventDto();
      evtDto.Data = new EventData();
      evtDto.Data.CopyFrom(evtDbo);
      if (evtDbo.Registrations != null) {

        evtDto.Registrations = new RegistrationsDto();
        evtDto.Registrations.Data = new List<RegistrationData>();

        foreach (var regDbo in evtDbo.Registrations) {
          // TODO: add the forwards, backs etc.
          var val = new RegistrationData();
          val.CopyFrom(regDbo);
          evtDto.Registrations.Data.Add(val);
        }
      }
      var linkEvt = Url.ActionLink(nameof(GetEvent), null, new { id = evtDbo.EventDboId });

      var home = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
      var linkReg = home + "/enroll/" + evtDbo.EventToken;
      evtDto.AddLink(LinkType.self, linkEvt);
      evtDto.AddLink(LinkType.other, linkReg);
      evtDto.AddLink(LinkType.routerLink, "enroll/" + evtDbo.EventToken);
      if (evtDbo.SeriesToken != Guid.Empty)
      {     
        evtDto.AddLink(LinkType.back, "series/" + evtDbo.SeriesToken);
      }
      evtDto.AddAction(ActionType.DELETE, linkEvt);
      return evtDto;
    }

    private EventDto CreateRegistrationDto(RegistrationDbo regDbo) {
      var regDto = new EventDto();
      regDto.Data = new EventData();
      regDto.Data.CopyFrom(regDbo);
      regDto.AddLink(LinkType.self, Url.ActionLink(nameof(GetEvent), null, new { id = regDbo.EventDboId }));
      return regDto;
    }

  }
}