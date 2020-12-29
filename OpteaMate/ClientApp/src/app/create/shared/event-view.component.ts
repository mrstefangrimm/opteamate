// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { IOptimum, Optimum } from '../../shared/models/optima.model'
import { OptimaSerivce } from '../../shared/services/optima.service'
import { OptimumEditComponent } from './optimum-edit.component'

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html'
})

export class EventViewComponent implements OnInit {

  @Input() config: EventViewComponentInput
  @Output() notify: EventEmitter<EventViewComponentOutput> = new EventEmitter<EventViewComponentOutput>();

  optima: IOptimum[]
  newEventTitle: string
  newEventLocation: string

  selectedOptimum: IOptimum
  selectedDate: Date
  selectedHour: number
  selectedMinutes: number
  nextSeriesToken: string

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private dialog: MatDialog,
    private optimaService: OptimaSerivce) {
  }

  ngOnInit() {
    this.dateAdapter.setLocale('de')

    console.info('ngOnInit')
    this.optimaService.getOptima()
      .subscribe(result => {
        console.log(result)
        this.optima = result.data.map(o => {
          // TODO: Factory
          let opt = {
            id: o.id,
            data: o.data,
            roles: []
          }
          return new Optimum(opt)
        })
        this.selectedOptimum = this.optima[0]
      }, error => console.error(error))

    this.setInitialDateTime()
  }

  addEvent() {
    console.info('addEvent')
    let start = this.selectedDate
    start.setHours(this.selectedHour, this.selectedMinutes, 0, 0)

    let evtArgs = Object.assign(new EventViewComponentOutput(), {
      title: this.newEventTitle,
      location: this.newEventLocation,
      start: start,
      optimumId: this.selectedOptimum.id,
    });

    this.notify.emit(evtArgs)

    // Workaround so that after the button type="reset" the selectedDate is correctly set
    setTimeout(() => this.setInitialDateTime())
  }

  addScheme() {
    console.info('addScheme')

    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.data = {
      selectedOptimum: this.selectedOptimum,
      optima: this.optima,
      seriesToken: this.config.seriesToken
    }     

    console.info(dialogConfig.data)
    const dialogRef = this.dialog.open(OptimumEditComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(
      data => {
        if (data != null) {
          console.info(data.data)
          this.selectedOptimum = this.optima.find(x => x.id == data.data)
        }
      })
  }


  setInitialDateTime() {
    let currentDate = new Date()
    this.selectedHour = currentDate.getMinutes() > 30 ? currentDate.getHours() + 1 : currentDate.getHours()
    this.selectedMinutes = 0
    this.selectedDate = currentDate
    this.selectedDate.setHours(currentDate.getHours() + 24, 0, 0, 0)
  }

  isFutureDate() {
    if (this.selectedDate == null) return false

    let selected = this.selectedDate
    selected.setHours(this.selectedHour, this.selectedMinutes, 0, 0)

    let inFuture = +selected - +new Date() > 1 * 60 * 60 * 1000
    return inFuture
  }
}

export class EventViewComponentInput {
  title: string
  buttonText: string
  seriesToken: string
}

export class EventViewComponentOutput {
  title: string
  location: string
  start: Date
  optimumId: number
}
