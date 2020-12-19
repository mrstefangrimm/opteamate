// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { HttpClient } from '@angular/common/http'
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing'
import { DateAdapter } from '@angular/material/core'
import { Router } from '@angular/router'
import { of } from 'rxjs'
import { TocResponse, TocService } from '../shared/services/toc.service'
import { HomeComponent } from './home.component'
import { EventViewComponentOutput } from './shared/event-view.component'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent
  let fixture: ComponentFixture<HomeComponent>
  const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
  const dateAdapterSpy = jasmine.createSpyObj('DateAdapter<Date>', ['setLocale'])
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post'])
  const tocServiceSpy = jasmine.createSpyObj('TocService', ['getTableOfContent'])
  const eventsServiceSpy = jasmine.createSpyObj('EventsService', ['getInfo', 'postEvent'])

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [HomeComponent],
        providers: [
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: Router, useValue: routerSpy },
          { provide: DateAdapter, useValue: dateAdapterSpy },
          { provide: HttpClient, useValue: httpClientSpy },
          { provide: TocService, useValue: tocServiceSpy }
        ]
      })

    fixture = TestBed.createComponent(HomeComponent)
    component = fixture.componentInstance

    // fixture.detectChanges()
  })

  it('given :all providers: when :created: then :should be truthy:', () => {
    expect(component).toBeTruthy()
  })

  it('given :events have post permission: when :ngOnInit: then :postPermission should be true:', () => {
    const givenTocResponse: TocResponse = { hrefs: {} }
    givenTocResponse.hrefs['events'] = 'aLocation'
    tocServiceSpy.getTableOfContent.and.returnValue(of(givenTocResponse))

    const givenEventsResponse = { hrefs: { } }
    givenEventsResponse.hrefs['post'] = ''
    httpClientSpy.get.and.returnValue(of(givenEventsResponse))

    component.ngOnInit()
    expect(component.postPermission).toBe(true)
  })

  it('given :successful init: when :onNotify: then :http post is called:', () => {
    const givenTocResponse: TocResponse = { hrefs: {} }
    givenTocResponse.hrefs['events'] = 'aLocation'
    tocServiceSpy.getTableOfContent.and.returnValue(of(givenTocResponse))

    const givenEventsResponse = { hrefs: {} }
    givenEventsResponse.hrefs['post'] = ''
    httpClientSpy.get.and.returnValue(of(givenEventsResponse))

    component.ngOnInit()

    const givenNewEvent: EventViewComponentOutput = { title: 'any', location: 'any', optimumId: 1, start: new Date }
    component.onNotify(givenNewEvent)

    expect(httpClientSpy.post.calls.count()).toEqual(1)
    expect(component.postPermission).toBe(true)
  })

   //it('should display a title', () => {
   // const titleText = fixture.nativeElement.querySelector('p').textContent
   // expect(titleText).toEqual('Create your events')
   //})

})
