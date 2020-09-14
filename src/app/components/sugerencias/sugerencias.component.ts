import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaestroService } from '../../services/maestro-service.service';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert';
import { SugerenciasService } from '../../services/sugerencias.service';

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.component.html',
  styleUrls: ['./sugerencias.component.css'],
  providers:[SugerenciasService]
})
export class SugerenciasComponent implements OnInit,OnDestroy {

  public url;
  public sugerenciasForm:FormGroup;
  private ngUnsubscribe: Subject<boolean> = new Subject();

  constructor(private fb:FormBuilder, private sugerenciaService:SugerenciasService,public maestroService:MaestroService,private router:Router) {
    this.url=GLOBAL.url;
    this.newForm();
   }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.unsubscribe();
  }

  newForm(){
    this.sugerenciasForm=this.fb.group({
      dni:["",Validators.required],
      nombre:["",Validators.required],
      celular:["",Validators.required],
      email:["",Validators.compose([Validators.email,Validators.required])],
      descripcion:["",Validators.required],
    });
  }

  saveSugerencia(){
    if(this.sugerenciasForm.valid==true){
     this.maestroService.busy= this.maestroService.busy=this.sugerenciaService.saveSugerencia(this.sugerenciasForm.value).pipe(takeUntil(this.ngUnsubscribe))
       .subscribe(
         res=>{
             console.log(res);
             if(res.sugerencia){
               swal("Sugerencia registrada","La sugerencia fue registrada exitosamente","success")
               .then((sugerenciaSave)=>{
                 if(sugerenciaSave){
                   this.newForm();
                 }
               });
             }
         },
         error=>{
   
         }
       );
    }else{
      swal("Atención","Todos los campos son obligatorios","info");
    }
  }
}
