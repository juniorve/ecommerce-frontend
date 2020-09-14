
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GLOBAL } from '../../../services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ComprobanteService } from '../../../services/comprobante.service';
import { MaestroService } from '../../../services/maestro-service.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
declare const swal: any;


@Component({
  selector: 'app-ganancias',
  templateUrl: './ganancias.component.html',
  styleUrls: ['./ganancias.component.css'],
  providers: [UserService, ComprobanteService, MaestroService]
})
export class GanananciasComponent implements OnInit, OnDestroy {

  public identity;
  public token;
  public url;
  private ngUnsubscribe: Subject<boolean> = new Subject();
  public ganancias: any[] = [];
  public fechasForm: FormGroup;
  public date=new FormControl(new Date());
  public date1=new FormControl(new Date());
  constructor(
    private comprobanteService: ComprobanteService,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private maestroService: MaestroService,
    private _userService: UserService) {
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    this.newForm();
  }

  ngOnInit() {
    this.getComprobantes();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.unsubscribe();
  }

  newForm() {
    this.fechasForm = this.fb.group({
      fechaInicio: [""],
      fechaFin: [""]
    });
    this.fechasForm.controls["fechaInicio"].setValue(this.date.value);
    this.fechasForm.controls["fechaFin"].setValue(this.date.value);
  }
  getComprobantes() {
    this.maestroService.busy = this.comprobanteService.getComprobantesxFecha(
      this.fechasForm.controls["fechaInicio"].value,this.fechasForm.controls["fechaFin"].value
    ).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => {
          console.log(res);
        },
        error => {
          console.log(error);
        }
      );

    /*   this.ganancias=[
    {usuario:'Juan Manuel', fecha:'16/10/2018', hora:'12:35', prenda:'Olla oster', cantidad:2, ganancia:'S/. 50'},
    {usuario:'María Lopez', fecha:'21/10/2018', hora:'2:40', prenda:'Cocina a gas', cantidad:4, ganancia:'S/.90'},
    {usuario:'Sofia Mendoza', fecha:'24/10/2018', hora:'3:10', prenda:'Olla a presión', cantidad:10, ganancia:'S/. 200'},
    {usuario:'Joaquin Torres', fecha:'2/11/2018', hora:'4:30', prenda:'Set de cubiertos bosh', cantidad:5, ganancia:'S/ .140'},
    {usuario:'Erika Chavez', fecha:'11/11/2018', hora:'11:14', prenda:'Utencilios de cocina', cantidad:8, ganancia:'S/. 100'},
  ] */
  }
}
