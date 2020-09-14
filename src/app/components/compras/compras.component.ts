import { MatDialog } from '@angular/material';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { GLOBAL } from '../../services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ComprobanteService } from '../../services/comprobante.service';
import { MaestroService } from '../../services/maestro-service.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DialogComponent } from '../dialog/dialog.component';
declare const swal: any;


@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css'],
  providers: [UserService, ComprobanteService, MaestroService]
})
export class ComprasComponent implements OnInit, OnDestroy {

  public identity;
  public selectedComprobante;
  public token;
  public url;
  private ngUnsubscribe: Subject<boolean> = new Subject();
  public comprobantes: any[] = [];
  public fechasForm: FormGroup;
  public date=new FormControl(new Date());
  public date1=new FormControl(new Date());
  constructor(
    private dialog:MatDialog,
    private comprobanteService: ComprobanteService,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private maestroService: MaestroService,
    private _userService: UserService) {
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
      console.log(this.identity);
  }

  ngOnInit() {
    this.getComprobantesxDNI();
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
      data: { tipo: "modalShowDetalleDNI", comprobante: this.selectedComprobante }
    });

    dialogRef.afterClosed().subscribe(result => {
     /*  console.log(result);
      if (result !== undefined) {
      } else {
        this.getComprobantes();
      } */
    });
  }

  getComprobantesxDNI() {
    this.maestroService.busy = this.comprobanteService.getComprobantesxDNI(
   this.identity.dni ).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => {
          console.log(res);
          this.comprobantes=[];
          if(res.comprobantes){
            this.comprobantes=res.comprobantes;
            for(let comprobante of this.comprobantes){
               comprobante.fecha = new Date(comprobante.fecha).toLocaleDateString('es-Pe',{day:"2-digit",month:"2-digit",year:"numeric"});
            }
          }
        },
        error => {
          console.log(error);
        }
      );
  }
}
