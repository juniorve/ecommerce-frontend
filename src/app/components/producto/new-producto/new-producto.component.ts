import { MaestroService } from './../../../services/maestro-service.service';
import { ProveedorService } from './../../../services/proveedor.service';
import { Producto } from './../../../models/producto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Proveedor } from '../../../models/proveedor';
import { GLOBAL } from '../../../services/global';
import { UserService } from '../../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { ProductoService } from 'src/app/services/producto.service';
const swal: SweetAlert = _swal as any;

declare var JQuery: any;
declare var $: any;


@Component({
  selector: 'new-producto',
  templateUrl: './new-producto.component.html',
  styleUrls: ['./new-producto.component.css'],
  providers: [ProductoService, UserService, ProveedorService]

})
export class NewProductoComponent implements OnInit {
  tallaControl = new FormControl([Validators.required]);
  envioControl = new FormControl([Validators.required]);

  envios = [
    { name: 'Si' },
    { name: 'No' },
  ];

  colores = [
    { nombre: 'Rojo', value: 'Rojo' },
    { nombre: 'Plateado', value: 'Plateado' },
    { nombre: 'Negro', value: 'Negro' },
    { nombre: 'Azul', value: 'Azul' },
    { nombre: 'Blanco', value: 'Blanco' }
  ];

  tipos = [
    { nombre: 'Olla', value: 'Olla' },
    { nombre: 'Sarten', value: 'Sarten' },
    { nombre: 'Cubiertos', value: 'Cubiertos' },
    { nombre: 'Cafetera', value: 'Cafetera' },
    { nombre: 'Batidora', value: 'Batidora' },
    { nombre: 'Vajillas', value: 'Vajillas' },
    { nombre: 'Hervidor', value: 'Hervidor' },
    { nombre: 'Set completo', value: 'Set completo' }
  ];

  marcas = [
    { nombre: 'Oster', value: 'Oster' },
    { nombre: 'Tramontina', value: 'Tramontina' },
    { nombre: 'Record', value: 'Record' },
    { nombre: 'Bosh', value: 'Bosh' },
    { nombre: 'T-Fal', value: 'T-Fal' },
    { nombre: 'Hervidor', value: 'Hervidor' }
  ];
  // date = new FormControl(new Date());
  // serializedDate = new FormControl((new Date()).toISOString());
  public identity;
  public title: String = 'Registro de nuevo producto';
  public token;
  public url;
  public producto: Producto;
  public mensajeError: String;
  public imagenTemp: any;

  constructor(private _productoService: ProductoService,
    public maestroService: MaestroService,
    private _proveedorService: ProveedorService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router) {
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.producto = new Producto('', null, null, null, null, null, '', '', '', '', '', '', '', this.identity._id, '');
  }

  ngOnInit() {
    this.getProveedores();
  }


  public proveedores: Proveedor[] = [];
  getProveedores() {
    this.maestroService.busy = this._proveedorService.getProveedores(this.token, this.identity._id).subscribe(
      response => {
        if (!response.proveedores) {

        } else {
          this.proveedores = response.proveedores;
          console.log(this.proveedores);
        }

      },
      error => {

      }
    );
  }

  saveProducto() {
    console.log(this.producto);
    this.maestroService.busy = this._productoService.saveProducto(this.token, this.producto).subscribe(
      response => {
        if (!response.producto) {
          swal('Error', 'el producto no se guardo correctamente', 'warning');
        }
        else {
          let id_producto = response.producto._id;
          this.makeFileRequest(this.url + 'upload-img-producto/' + id_producto, [],
            this.filesToUpload).then(
              (result) => {
                swal('Producto registrado', 'Datos guardados correctamente', 'success')
                  .then((prodCreate) => {
                    if (prodCreate) {
                      this._router.navigate(['/adm-producto']);
                    }
                  });
              },
              (error) => {
                console.log(error);
              }
            );
        }
      },
      error => {
        this.mensajeError = error;
        let errorMessage = <any>error;
        if (errorMessage != null) {
          console.log(error);
        }
      }
    );
  }
  //--------------------imagenes--------------

  public filesToUpload: Array<File>;

  fileChangeEvent(fileInput: any, archivo: File) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    let reader = new FileReader();
    let urlImgTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => {
      console.log(reader.result);
      this.imagenTemp = reader.result;
    };
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    var token = this.token;

    return new Promise(function (resolve, reject) {
      var formData: any = new FormData;
      var xhr = new XMLHttpRequest();

      for (var i = 0; i < files.length; i++) {
        formData.append('imagen', files[i], files[i].name);
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    });

  }


}
