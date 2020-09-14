import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import swal from 'sweetalert';
import { ProductoService } from '../../services/producto.service';
import { GLOBAL } from '../../services/global';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MaestroService } from '../../services/maestro-service.service';
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  providers: [ProductoService],
  // encapsulation: ViewEncapsulation.None
})
export class CategoriasComponent implements OnInit, OnDestroy {
  public url;
  public productos: any[] = [];
  public listProductos: any[] = [];
  public precioRange: FormControl = new FormControl();
  tipoProducto: FormControl = new FormControl();
  colorProducto: FormControl = new FormControl();
  public listOrdenes = [
    { tipo: "Por defecto", value: 1 },
    { tipo: "Por Nombre", value: 2 },
    { tipo: "Por precio", value: 3 }
  ]

  tipos = [
    { nombre: "Productos", value: "Productos" },
    { nombre: "Olla", value: "Olla" },
    { nombre: "Cubiertos", value: "Cubiertos" },
    { nombre: "Cafetera", value: "Cafetera" },
    { nombre: "Batidora", value: "Batidora" },
    { nombre: "Vajillas", value: "Vajillas" },
    { nombre: "Hervidor", value: "Hervidor" },
    { nombre: "Set completo", value: "Set completo" }
  ];

  colores=[
    {nombre:"Todos",value:"Todos"},
    {nombre:"Rojo",value:"Rojo"},
    {nombre:"Plateado",value:"Plateado"},
    {nombre:"Negro",value:"Negro"},
    {nombre:"Azul",value:"Azul"},
    {nombre:"Blanco",value:"Blanco"}
  ];

  private ngUnsubscribe: Subject<boolean> = new Subject();

  public tipoOrden: FormControl = new FormControl();
  constructor(private router:Router,private _productoService: ProductoService, 
    public maestroService: MaestroService) {
    this.url = GLOBAL.url;
    this.tipoOrden.setValue(1);
    this.precioRange.setValue(10);
    this.tipoProducto.setValue("Productos");
    this.colorProducto.setValue("Todos");
  }

  ngOnInit() {
    this.getProductos();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.unsubscribe();
  }

  addProducto(producto: any) {
   producto.cantidadCarrito=1;
    // swal("Producto agregado","El producto fue agregado al carrito","success");
    this.maestroService.addCarrito(producto);
  }

  payProducts(sumaTotal){
    let pagoTotal=sumaTotal+10;
    this.router.navigate(['/pagar-total/'+pagoTotal]);
  }

  sendProducto(idProducto:any){
    this.router.navigate(['/show-producto/'+idProducto]);
  }

  viewRange() {
    // this.getProductos();
    console.log(this.precioRange.value);
    this.productos = [];
    if (this.precioRange.value == 10) {
      this.productos = this.listProductos;
    } else {
      for (let producto of this.listProductos) {
        if (producto.precioVenta < this.precioRange.value && producto.precioVenta > 10) {
          this.productos.push(producto);
        }
      }
    }
    console.log(this.productos);
  }
  getProductos() {

    this.maestroService.busy = this._productoService.getTProductos().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        console.log(response);
        if (!response.productos) {
        } else {
          // this.productos= response.productos;
          this.listProductos = response.productos;

          this.changeOrden();
        }
      },
      error => {
      }
    );
  }

  filterByTipo() {
    if(this.tipoProducto.value!='Productos'){
      this.productos = this.productos.filter(producto => producto.tipo == this.tipoProducto.value);
    }
    console.log(this.productos);
  }

  filterByColor() {
    if(this.colorProducto.value!='Todos'){
      this.productos = this.productos.filter(producto => producto.color == this.colorProducto.value);
    }
    console.log(this.productos);
  }

  changeOrden() {
    this.productos = [];
    if (this.tipoOrden.value == 1) {
      this.viewRange();
      this.filterByTipo();
      this.filterByColor();
      // this.productos=this.listProductos;
    } else {
      if (this.tipoOrden.value == 2) {
        //  this.productos=this.listProductos;
        this.viewRange();
        this.filterByTipo();
        this.filterByColor();
        this.productos.sort(
          function (a, b) {
            if (a.nombre > b.nombre) {
              return 1;
            }
            if (a.nombre < b.nombre) {
              return -1;
            }
            // a must be equal to b
            return 0;
          }
        )
        console.log(this.productos);
      } else {
        if (this.tipoOrden.value == 3) {
          // this.productos=this.listProductos;
          this.viewRange();
          this.filterByTipo();
          this.filterByColor();
          this.productos.sort(
            function (a, b) {
              if (a.precioVenta > b.precioVenta) {
                return 1;
              }
              if (a.precioVenta < b.precioVenta) {
                return -1;
              }
              // a must be equal to b
              return 0;
            }
          )
          console.log(this.productos);
        }
      }
    }
  }
}
