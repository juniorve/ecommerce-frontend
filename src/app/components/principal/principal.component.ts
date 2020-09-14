import { Component, OnInit } from '@angular/core';
import { MaestroService } from '../../services/maestro-service.service';
import { GLOBAL } from 'src/app/services/global';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  public url;
  constructor(public maestroService:MaestroService,private router:Router) {
    this.url=GLOBAL.url
   }

  ngOnInit() {
  }
  payProducts(sumaTotal){
    let pagoTotal=sumaTotal+10;
    this.router.navigate(['/pagar-total/'+pagoTotal]);
  }
}
