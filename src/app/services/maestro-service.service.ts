import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaestroService{
  public busy:Subscription;
  public carritoProd:any[]=[];
  public sumaTotal=0;

  constructor() { }

  clean(){
    this.carritoProd=[];
  }
  addCarrito(_producto:any){
    let producto:any={};
    producto=_producto;
    this.sumaTotal=0;
    if(this.carritoProd.length>0){
      let indice=-1;
      for(let i=0 ;i<this.carritoProd.length;i++){
        if(producto.nombre==this.carritoProd[i].nombre){
          indice=i;
        }
      }
      if(indice>=0){
        console.log("entra",producto.cantidadCarrito);
          this.carritoProd[indice].cantidadCarrito=this.carritoProd[indice].cantidadCarrito+producto.cantidadCarrito;
      }else{
        // producto.cantidadCarrito=1;
        this.carritoProd.push(producto);
      }
    }else{
      // producto.cantidadCarrito=1;
      this.carritoProd.push(producto);
    }
    for(let prod of this.carritoProd){
      this.sumaTotal=this.sumaTotal+prod.precioVenta*prod.cantidadCarrito;
    }
    console.log(this.carritoProd);
  }
}
