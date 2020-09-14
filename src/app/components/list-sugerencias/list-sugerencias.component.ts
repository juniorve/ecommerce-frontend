import { SugerenciasService } from './../../services/sugerencias.service';
import { MatDialog } from '@angular/material';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MaestroService } from '../../services/maestro-service.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DialogComponent } from '../dialog/dialog.component';
declare const swal: any;


@Component({
  selector: 'app-list-sugerencias',
  templateUrl: './list-sugerencias.component.html',
  styleUrls: ['./list-sugerencias.component.css'],
  providers: [UserService, MaestroService,SugerenciasService]
})
export class ListSugerenciasComponent implements OnInit, OnDestroy {

  public identity;
  public selectedSugerencia;
  public token;
  public url;
  private ngUnsubscribe: Subject<boolean> = new Subject();
  public sugerencias: any[] = [];
  constructor(
    private dialog:MatDialog,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private maestroService: MaestroService,
    private sugerenciaService:SugerenciasService,
    private _userService: UserService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.getSugerencias();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.unsubscribe();
  }

 

  onRowSelect(event){
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '1000px',
      // height: '700px',
      data: { tipo: "modalShowSugerencia", sugerencia: this.selectedSugerencia }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getSugerencias() {
    this.maestroService.busy = this.sugerenciaService.getSugerencias().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => {
          console.log(res);
          this.sugerencias=[];
          if(res.sugerencias){
            this.sugerencias=res.sugerencias;
          }
        },
        error => {
          console.log(error);
        }
      );
  }
}
