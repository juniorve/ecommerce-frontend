import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { MaestroService } from '../../services/maestro-service.service';
import { GLOBAL } from '../../services/global';
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
// public total="400.00";
public url;
  constructor(private _router:Router, private maestroService:MaestroService) {
    this.url=GLOBAL.url;
   }

  ngOnInit() {
  }

  payProducts(sumaTotal){
    let total=sumaTotal+10;
    console.log(total);
    this._router.navigate(['/pagar-total/'+total]);
  }
}
