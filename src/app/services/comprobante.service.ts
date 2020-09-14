import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { GLOBAL } from './global';


@Injectable()

export class ComprobanteService {

    public url: String;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    saveComprobante(total: any) {

        let json = JSON.stringify(total);
        let params = json;

        let headers = new Headers({ 'Content-Type': 'application/json' });

        return this._http.post(this.url + 'comprobantes', params, { headers: headers })
            .map(res => res.json());
    }

    saveDetalleComprobante(detalle: any) {

        let json = JSON.stringify(detalle);
        let params = json;

        let headers = new Headers({ 'Content-Type': 'application/json' });

        return this._http.post(this.url + 'detallecomprobante', params, { headers: headers })
            .map(res => res.json());
    }

    getComprobantesById(totalId = null) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.url + 'comprobantes/' + totalId, options)
            .map(res => res.json());
    }


    getComprobantesxFecha(fechaInicio: any, fechaFin: any) {
        console.log(fechaInicio,fechaFin);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.url + 'getcomprobantes/' + fechaInicio + '/' + fechaFin, options)
            .map(res => res.json());
    }

    getComprobantesxDNI(dni: any) {
        console.log(dni);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.url + 'getcomprobantesDni/' + dni, options)
            .map(res => res.json());
    }

    getDetalleComprobante(idComprobante: any) {
        console.log(idComprobante);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.url + 'detallecomprobante/' + idComprobante, options)
            .map(res => res.json());
    }

}
