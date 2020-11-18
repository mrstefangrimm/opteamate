// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Inject, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'event-edit',
  templateUrl: './event-edit.component.html'
})

export class EventEditComponent implements OnInit {

  eventId: number
  eventTitle: string
  eventLocation: string
  selectedDate: Date
  selectedHour: number
  selectedMinutes: number
  canDelete: boolean

  constructor(
    private dialogRef: MatDialogRef<EventEditComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.eventId = data.eventId
    this.eventTitle = data.eventTitle
    this.eventLocation = data.eventLocation
    this.selectedDate = data.eventStartTime
    this.canDelete = data.canDelete

    console.info(data.eventStartTime)
    this.selectedHour = data.eventStartTime.getHours()
    this.selectedMinutes = this.selectedDate.getMinutes()
  }

  ngOnInit() {
  }

  apply() {
    var start = this.selectedDate
    start.setHours(this.selectedHour, this.selectedMinutes, 0, 0)

    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      eventId: this.eventId,
      eventTitle: this.eventTitle,
      eventLocation: this.eventLocation,
      eventStartTime: start,
      deleteEvent: false
    };
    this.dialogRef.close(dialogConfig)
  }

  delete() {
    if (confirm('Willst du \'' + this.eventTitle + '\' für immer löschen?')) {
      const dialogConfig = new MatDialogConfig()
      dialogConfig.data = {
        eventId: this.eventId,
        deleteEvent: true
      };
      this.dialogRef.close(dialogConfig)
    }
  }

  cancel() {
    this.dialogRef.close()
  }

  isFutureDate() {
    if (this.selectedDate == null) return false

    var selected = this.selectedDate
    selected.setHours(this.selectedHour, this.selectedMinutes, 0, 0)

    let inFuture = +selected - +new Date() > 1 * 60 * 60 * 1000
    return inFuture
  }
}
