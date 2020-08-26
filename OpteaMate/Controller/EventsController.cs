// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace opteamate {

  [Route("api/[controller]")]
  [ApiController]
  public class EventsController : ControllerBase {
    private readonly OpteaMateContext _context;

    public EventsController(OpteaMateContext context) {
      _context = context;
    }

    // GET: api/events
    [HttpGet]
    public object GetEvents() {

      var evtsDbo = _context.Events.ToList();

      var eventsDto = new EventsDto();
      eventsDto.AddLink(LinkType.self, Url.ActionLink(nameof(GetEvents)));
      eventsDto.AddAction(ActionType.GET, "this");

      if (evtsDbo.Count > 0) {
        // Do not load registration to reduce network traffic
        // _context.Registrations.Load();

        eventsDto.Data = new List<EventDto>();

        foreach (var evtDbo in evtsDbo) {
          var evtDto = CreateEventDto(evtDbo);
          eventsDto.Data.Add(evtDto);
        }
      }
      return eventsDto;
    }

    // GET: api/events/5
    [HttpGet("{id}")]
    public object GetEvent(long id) {

      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }
      _context.Registrations.Load();

      var evtDto = CreateEventDto(evtDbo);
      return evtDto;

      //var evt = _context.EventDbo.Find(id);
      //if (evt == null) { return NotFound(); }
      //// _context.RegistrationData.Load();
      //return GetEventDto(evt);
    }

    //// GET: api/events/99ad2095-52ea-49bd-a8fb-bbc8a88ef065
    //[HttpGet("{eventtoken}")]
    //public object GetEvent(Guid eventtoken) {

    //  var evtDbo = _context.Events.Find(1);
    //  if (evtDbo == null) { return NotFound(); }
    //  _context.Registrations.Load();

    //  var evtDto = CreateEventDto(evtDbo);
    //  return evtDto;
    //}

    //GET "http://localhost:5000/api/events/byname?firstName=a&lastName=b"
    [HttpGet("byName")]
    public object Get(string firstName, string lastName) {
      return NoContent();
    }

    [HttpPost]
    public object PostEvent(EventData evt) {

      var evtDbo = new EventDbo();
      evt.EventToken = Guid.NewGuid();
      evtDbo.CopyFrom(evt);

      _context.Events.Add(evtDbo);
      int modifiedObjs = _context.SaveChanges();

      var evtDto = CreateEventDto(evtDbo);
      return CreatedAtAction(nameof(GetEvent), new { id = evtDbo.EventDboId }, evtDto);

      //if (evt.Registrations != null) {
      //  foreach (var reg in evt.Registrations) {
      //    reg.EventId = evt.Id;
      //  }
      //}
      //int modifiedObjs = _context.SaveChanges();
      //var eventDto = GetEventDto(evt);
      //return CreatedAtAction(nameof(GetEvent), new { id = evt.EventDataId }, eventDto);
    }

    // POST: api/events/1/registrations
    [HttpPost("{id}/registrations")]
    public object PostEventRegistration(long id, RegistrationData reg) {

      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }

      _context.Registrations.Load();

      if (evtDbo.Registrations == null) { evtDbo.Registrations = new List<RegistrationDbo>(); }
      var regDbo = new RegistrationDbo();
      evtDbo.Registrations.Add(regDbo);
      regDbo.CopyFrom(reg);

      _context.Update(evtDbo);
      var modified = _context.SaveChanges();

      var evtDto = CreateEventDto(evtDbo);
      return CreatedAtAction(nameof(GetEvent), new { id = evtDbo.EventDboId }, evtDto);


      //var evtData = _context.EventData.Find(id);
      //if (evtData == null) { return NotFound(); }

      //reg.EventId = evtData.Id;

      //_context.RegistrationData.Load();

      //if (evtData.Registrations == null) { evtData.Registrations = new List<RegistrationData>(); }
      //evtData.Registrations.Add(reg);
      //_context.Update(evtData);

      //var modified = _context.SaveChanges();
      //return GetEventDto(evtData);
    }

    // PUT: api/events/5
    [HttpPut("{id}")]
    public object PutEvent(long id, EventData evt) {

      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }

      evtDbo.CopyFrom(evt);
      _context.Entry(evtDbo).State = EntityState.Modified;

      try {
        var res = _context.SaveChanges();
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
    public object PutEventRegistration(long id, long regid, RegistrationData reg) {

      if (!_context.Events.Any(e => e.EventDboId == id)) { return NotFound(); }
      var regDbo = _context.Registrations.Find(regid);
      if (regDbo == null) { return NotFound(); }

      regDbo.CopyFrom(reg);
      _context.Entry(regDbo).State = EntityState.Modified;

      try {
        var res = _context.SaveChanges();
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
    public object DeleteEvent(long id) {

      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }

      _context.Events.Remove(evtDbo);

      _context.Registrations.Load();
      if (evtDbo.Registrations != null) {
        _context.Registrations.RemoveRange(evtDbo.Registrations.ToArray());
      }

      var modified = _context.SaveChanges();

      return NoContent();
    }

    // DELETE: api/events/5/registrations/regid
    [HttpDelete("{id}/registrations/{regid}")]
    public object DeleteEventRegistration(long id, long regid) {

      var evtDbo = _context.Events.Find(id);
      if (evtDbo == null) { return NotFound(); }

      var regDbo = _context.Registrations.Find(regid);
      if (regDbo == null) { return NotFound(); }

      evtDbo.Registrations.Remove(regDbo);
      _context.Registrations.Remove(regDbo);
      _context.Update(evtDbo);

      var modified = _context.SaveChanges();
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
      return evtDto;
    }

    private EventDto CreateRegistrationDto(RegistrationDbo regDbo) {
      var regDto = new EventDto();
      regDto.Data = new EventData();
      regDto.Data.CopyFrom(regDbo);
      regDto.AddLink(LinkType.self, Url.ActionLink(nameof(GetEvent), null, new { id = regDbo.EventDboId }));
      return regDto;
    }

    //  private HypermediaDtoBase<EventDto> GetEventDto(EventDto evtData) {
    //    var eventDto = HypermediaUtil.CreateHypermediaDto(evtData);
    //// eventDto.Data.Registrations
    //    eventDto.AddLink(LinkType.self, Url.ActionLink(nameof(GetEvent), null, new { id = evtData.EventDataId }));
    //    return eventDto;
    //  }    

  }
}