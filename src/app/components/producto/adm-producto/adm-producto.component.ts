import { UserService } from 'src/app/services/user.service';
import { ProductoService } from './../../../services/producto.service';
import { Producto } from './../../../models/producto';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GLOBAL } from '../../../services/global';
import { MatDialog } from '@angular/material'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MaestroService } from '../../../services/maestro-service.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
declare const swal: any;


@Component({
  selector: 'app-adm-producto',
  templateUrl: './adm-producto.component.html',
  styleUrls: ['./adm-producto.component.css'],
  providers: [ProductoService, UserService]
})
export class AdmProductoComponent implements OnInit, OnDestroy {

  public identity;
  private ngUnsubscribe: Subject<boolean> = new Subject();
  public token;
  public url;
  public band_editar: boolean;
  public productos: Producto[] = [];
  public _idEvento: String;
  constructor(
    private _productoService: ProductoService, private _route: ActivatedRoute, private maestroService: MaestroService,
    private _router: Router,
    private _userService: UserService) {
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.getProductos();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.unsubscribe();
  }

  public cantidad: any = 0;
  getProductos() {
    this.maestroService.busy = this._productoService.getProductos(this.token, this.identity._id).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        response => {
          console.log(response);
          if (!response.productos) {
          } else {
            this.productos = response.productos;
            this.cantidad = this.productos.length;
          }
        },
        error => {
        }
      );
  }

  editProducto(idProducto: String) {
    console.log("aaa")
    this._router.navigate(['/edit-producto/' + idProducto]);
  }


  deleteProducto(idProducto: any) {

    swal({
      title: "Eliminar producto", text: "¿Usted esta seguro de eliminar el producto?", icon: "info",
      buttons: ['Cancelar', 'Confirmar']
    })
      .then((deleteProd) => {
        if (deleteProd) {
        this.maestroService.busy=this._productoService.deleteProducto(this.token, idProducto).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            response => {
              if (!response.producto) {
                swal('Error', 'El producto no se elimino correctamente', 'warning');
              } else {
                swal('Producto eliminado', 'El producto se elimino correctamente', 'success')
                  .then((deleteProd) => {
                    if (deleteProd) {
                      this.getProductos();
                    }
                  });
              }
            },
            error => {
            }
          );
        }
      });
  }
}
