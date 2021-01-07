// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, Inject, OnInit } from '@angular/core'
import { OptimaSerivce } from '../../shared/services/optima.service'
import { Optimum } from '../../shared/models/optima.model'
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog'

@Component({
  selector: 'app-optimum-edit',
  templateUrl: './optimum-edit.component.html'
})

export class OptimumEditComponent implements OnInit {

  currentOptimum: Optimum
  optima: Optimum[]
  optimaMat: string[][]
  optimaMax: { [role: string]: string }
  newRoleName: string
  seriesToken: string

  constructor(
    private dialogRef: MatDialogRef<OptimumEditComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private optimaService: OptimaSerivce) {

    console.info(data) 
    this.currentOptimum = new Optimum(data.selectedOptimum)
    this.currentOptimum.data.name += +data.optima.length
    this.optima = data.optima
    this.seriesToken = data.seriesToken
  }

  ngOnInit(): void {
    this.optimaMat = this.currentOptimum.getOptimaAsMatrix()   
    console.info(this.optimaMat)

    this.optimaMax = this.currentOptimum.getMaximaAsDictonary()  
    console.info(this.optimaMax)
  }

  addRole() {
    console.info('addRole')

    this.optimaMat[0].push(this.newRoleName)
    this.optimaMax[this.newRoleName] = undefined

    // add a '*' as optimum for the new role for each optima
    this.optimaMat.slice(1, this.optimaMat.length).forEach(x => x.push('*'))
    console.info(this.optimaMat)
  }

  removeRole() {
    console.info('removeRole')
    if (this.optimaMat[0].length > 1) {
      for (let n = 0; n < this.optimaMat.length; n++) {
        this.optimaMat[n].pop()
      }
    }
    console.info(this.optimaMat)
  }

  addOptima() {
    console.info('addOptima')
    // an array with the size of the number of current roles
    let optArr = new Array<string>(this.optimaMat[0].length)
    for (let n = 0; n < optArr.length; n++) {
      optArr[n] = '*'
    }
    this.optimaMat.push(optArr)
    console.info(this.optimaMat)
  }

  removeOptima() {
    console.info('removeOptima')
    if (this.optimaMat.length > 2) {
      this.optimaMat.pop()
    }
    console.info(this.optimaMat)
  }

  apply() {
    console.info('apply')
    this.currentOptimum.setOptimaFromMatrix(this.optimaMat)
    this.currentOptimum.setMaximaFromDictonary(this.optimaMax)
    console.info(this.currentOptimum.data)
    this.currentOptimum.data.seriesToken = this.seriesToken
    this.optimaService.postOptimum(this.currentOptimum.data).subscribe(
      result => {
        console.info(result)
        let opt = {
          id: result.id,
          data: result.data,
          roles: []
        }
        this.optima.push(new Optimum(opt))
        console.info(this.optima)
        const dialogConfig = new MatDialogConfig()
        dialogConfig.data = opt.id
        this.dialogRef.close(dialogConfig)
      },
      err => {
        console.error(err)
      }
    )
  }

  cancel() {
    this.dialogRef.close()
  }

}
