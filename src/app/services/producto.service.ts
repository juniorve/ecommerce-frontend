import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Producto } from './../models/producto';


@Injectable()

export class ProductoService {

  public url: String;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  saveProducto(token, producto: Producto) {

    let json = JSON.stringify(producto);
    let params = json;

    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });

    return this._http.post(this.url + 'producto', params, { headers: headers })
      .map(res => res.json());
  }

  getProducto(productoId) {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this._http.get(this.url + 'producto/' + productoId, options)
      .map(res => res.json());
  }


  getProductos(token, user:any) {

    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this._http.get(this.url + 'productos/'+user, options)
      .map(res => res.json());
  }

  getTProductos() {

    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this._http.get(this.url + 'getProductos', options)
      .map(res => res.json());
  }


   




  updateProducto(id: String, producto: any) {
    console.log(id,producto);
    let json = JSON.stringify(producto);
    let params = json;

    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this._http.put(this.url + 'producto/' + id, params, { headers: headers })
      .map(res => res.json());
  }

  deleteProducto(token, id: String) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this._http.delete(this.url + 'producto/' + id, options).map(res => res.json());
  }

}
