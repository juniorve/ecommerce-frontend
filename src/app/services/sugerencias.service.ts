import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Producto } from './../models/producto';


@Injectable()

export class SugerenciasService {

  public url: String;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  saveSugerencia(producto: Producto) {

    let json = JSON.stringify(producto);
    let params = json;

    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this._http.post(this.url + 'sugerencias', params, { headers: headers })
      .map(res => res.json());
  }

  getSugerenciaById(sugerenciaId = null) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.get(this.url + 'sugerencias/' + sugerenciaId, options)
      .map(res => res.json());
  }


  getSugerencias() {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.get(this.url + 'getsugerencias', options)
      .map(res => res.json());
  }

}
