import { ProductoService } from './../../services/producto.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MaestroService } from '../../services/maestro-service.service';
import { GLOBAL } from 'src/app/services/global';
import { Subject } from 'rxjs/Subject';
import swal from "sweetalert";
import { takeUntil } from 'rxjs/operators';
import { ComprobanteService } from '../../services/comprobante.service';

var jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-pagar-total',
  templateUrl: './pagar-total.component.html',
  styleUrls: ['./pagar-total.component.css'],
  providers: [ComprobanteService, ProductoService]
})
export class PagarTotalComponent implements OnInit, OnDestroy {
  public totalForm: FormGroup
  envios = [
    { name: 'Si' },
    { name: 'No' },
  ];
  private ngUnsubscribe: Subject<boolean> = new Subject();
  public identity;
  public title: String = 'Pago del total de compras';
  public token;
  public detalle:any[]=[];
  public url;
  public mensajeError: String;
  public imagenTemp: any;
  public date = new FormControl(new Date());
  public date1 = new FormControl(new Date());
  public bandera=false;

  constructor(private fb: FormBuilder, private maestroService: MaestroService, private comprobanteService: ComprobanteService,
    private _route: ActivatedRoute, private productoService: ProductoService,
    private _router: Router) {
    this.url = GLOBAL.url;
    this.newForm();
  }

  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      if (params['total']) {
        this.totalForm.controls["total"].setValue(parseFloat(params['total']));
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.unsubscribe();
  }

  saveTotal() {
    console.log(this.totalForm.getRawValue());
    if (this.totalForm.valid == true) {
      this.maestroService.busy = this.comprobanteService.saveComprobante(this.totalForm.getRawValue()).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            swal("Pago realizado", "El pago de productos fue realizado correctamente", {
              icon: 'success', closeOnClickOutside: false
            }).then(
              (pagoProductos) => {
                if (pagoProductos) {
                  console.log(res);
                  for (let i = 0; i < this.maestroService.carritoProd.length; i++) {
                    let data: any = {};
                    data.cantidad = this.maestroService.carritoProd[i].cantidadCarrito;
                    data.precio = this.maestroService.carritoProd[i].precioVenta;
                    data.idProducto = this.maestroService.carritoProd[i]._id;
                    data.idComprobante = res.comprobante._id;
                    
                    this.getDetalleComprobante(data.idComprobante); 
                    this.maestroService.busy = this.comprobanteService.saveDetalleComprobante(data).pipe(takeUntil(this.ngUnsubscribe))
                      .subscribe(
                        resp => {
                          this.maestroService.carritoProd[i].cantidad = this.maestroService.carritoProd[i].cantidad - this.maestroService.carritoProd[i].cantidadCarrito
                          this.maestroService.busy = this.productoService.updateProducto(this.maestroService.carritoProd[i]._id, this.maestroService.carritoProd[i]).pipe(takeUntil(this.ngUnsubscribe))
                            .subscribe(
                              response => {
                                console.log(response);
                                if (i == this.maestroService.carritoProd.length - 1) {
                                  this.maestroService.clean();
                                 /*  this._router.navigate(['/principal']); */
                                    this.bandera=true;
                                }
                              },
                              errors => {

                              }
                            );
                        },
                        err => {
                          console.log(err);
                        }
                      );;
                  }

                }
              });
          },
          error => {
            console.log(error);
          }
        );
    } else {
      swal("Campos incompletos", "Algunos campos del formulario no fueron completados", "warning");
    }
  }

  getDetalleComprobante(idComprobante:any){
    this.maestroService.busy=this.comprobanteService.getDetalleComprobante(idComprobante).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
       res=>{
         console.log(res);
         if(res.detalleComprobante){
           this.detalle=res.detalleComprobante;
           for(let item of this.detalle){
               this.getProductos(item)
           }
           console.log(this.detalle);
         }
       },
       error=>{
         console.log(error);
       }
     );
   }
 
   getProductos(item:any)
   {        
      this.maestroService.busy= this.productoService.getProducto(item.idProducto).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
             response =>{
               console.log(response);
               if(response.producto){
                 item.nameProducto= response.producto.nombre;
                 item.color= response.producto.color;
                 item.material= response.producto.material;
                 item.marca= response.producto.marca;
               } 
             },
           error =>{
           }
      );
     }

  newForm() {
    this.totalForm = this.fb.group({
      nombre: ["", Validators.required],
      email: ["", Validators.compose([Validators.email, Validators.required])],
      dni: [null, Validators.required],
      numCuenta: [null, Validators.required],
      cvv: ["", Validators.required],
      total: [null, Validators.required],
      vencimiento: [""],
      fecha: [""]
    });
    this.totalForm.controls["total"].disable();
    this.totalForm.controls["vencimiento"].setValue(this.date.value);
    this.totalForm.controls["fecha"].setValue(this.date1.value);
  }



  PDF() {

    // let doc = new jsPDF('p', 'pt', 'a4',true);
    let doc:any={};
    doc  = new jsPDF('p', 'pt', 'a4',1);
    let totalPagesExp = "{total_pages_count_string}";

    let columns = ["N°", "PRODUCTO", "COLOR", "MARCA", "MATERIAL", "PRECIO", "CANTIDAD"];
    let rows: Array<object> = [];
    for (let i = 0; i < this.detalle.length; i++) {
      rows[i] = [];
      rows[i]["0"] = i + 1;
      rows[i]["1"] =this.detalle[i].nameProducto;
      rows[i]["2"] =this.detalle[i].color;
      rows[i]["3"] =this.detalle[i].marca;
      rows[i]["4"] =this.detalle[i].material;
      rows[i]["5"] =this.detalle[i].precio;
      rows[i]["6"] =this.detalle[i].cantidad;
    }

    let cm = this;
    let headerFooter = function (data, event) {
      console.log(data, event);
      doc = doc;
      // item = item;
      cm.textPDF(doc, data, totalPagesExp);
    };
    let options = {
      addPageContent: headerFooter,

      startY: 190,
      margin: { right: 42, left: 40, top: 190, bottom: 180 },
      theme: 'plain',
      styles: {
        fontSize: 6,
        lineHeight: 2,
        fontStyle: 'normal',
      },
      headerStyles: {
        halign: 'center',
        valign: 'middle',
        fillColor: 255,
        textColor: 0,
        lineWidth: 0.1,
        lineColor: 0,
        columnWidth: 'wrap',
        //overflow: 'linebreak',
        fontStyle: 'bold'
      },
      columnStyles: {
        // tableLineColor: 200,

        0: { halign: 'center', width: 'wrap', columnWidth: 'linebreak' },
        1: { halign: 'left', width: 'wrap', columnWidth: 'linebreak' },
        2: { halign: 'left', width: 'wrap', columnWidth: 'linebreak' },
        3: { halign: 'left', width: 'wrap', columnWidth: 'linebreak' },
        4: { halign: 'left', width: 'wrap', columnWidth: 'linebreak' },
        5: { halign: 'right', width: 'wrap', columnWidth: 'linebreak' },
        6: { halign: 'right', width: 'wrap', columnWidth: 'linebreak' }
      }
    }
    doc.autoTable(columns, rows, options);
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    let blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }


  
  textPDF(doc, pdfResultsData, totalPagesExp) {
    let y = 0;

    // var pdf = new jsPDF();
  /*   var img = new Image;
         doc.addImage(this, 'PNG', 180, 5, 240, 90, 'center');
    img.crossOrigin = "";  
    img.src = "assets/img/logo.png";
 */
    // let imgData = 'data:image/jpeg;base64,' + this.datoEmpresa['logo'];
    //       doc.addImage(imgData, 'JPEG', 180, 5, 240, 90, 'center');
   
      doc.setFontSize(8);
      doc.setFontType("bold");
      let lines = doc.splitTextToSize("ICHICAWA", 350);
      doc.text(300, 95, lines, 'center');
      y = 0 + (8 * (lines.length - 1));

    doc.setFontSize(8);
    doc.setFontType("bold");
     lines = doc.splitTextToSize( 'DIRECCION: ' + "Jirón Junín 774, Cercado de Lima 15001", 250);
    doc.text(300, 103 + y, lines, 'center');
      doc.text(300, 112 + (8 * (lines.length - 1)) + y, `RUC: 12434434324`, 'center');

    doc.setFontSize(7);

    //DATOS DEL COMPROBANTE
    doc.setFontType("normal");
    doc.text(42, 145, `DNI: ${this.totalForm.controls["dni"].value}`);
    doc.text(42, 165, `Email: ${this.totalForm.controls["email"].value}`);
    doc.text(250, 165, `Nombre: ${this.totalForm.controls["nombre"].value}`);
    doc.text(42, 155, `Fecha: ${new Date(this.totalForm.controls["fecha"].value).toLocaleDateString("es-Pe",{day:"2-digit",month:"2-digit",year:"numeric"})}`);
    doc.text(250, 155, `Total: S/. ${this.totalForm.controls["total"].value}`);
   
    doc.setFontType("bold");    
    doc.text(42, 180, `Lista de productos comprados`);
 

    doc.setFontStyle('bold');
    doc.setDrawColor(0);
    doc.roundedRect(40, 190, 513, 530, 3, 3);
    let str = "Página " + pdfResultsData.pageCount;
    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
      str = str + " de " + totalPagesExp;
    }
    doc.setTextColor(0, 0, 0);
    doc.text(str, 550, 800, "center");
  }


}
