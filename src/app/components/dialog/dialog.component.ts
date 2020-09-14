import { ComprobanteService } from './../../services/comprobante.service';
import { Component, OnInit, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import swal from 'sweetalert';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { MaestroService } from '../../services/maestro-service.service';
import { takeUntil } from 'rxjs/operators';
import { ProductoService } from '../../services/producto.service';
// import jsPDF from 'jspdf';
// import * as autoTable from 'jspdf-autotable'
/* import * as jsPDF from 'jspdf';
import * as autoTable from 'jspdf-autotable'; */

var jsPDF = require('jspdf');
require('jspdf-autotable');
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  // encapsulation: ViewEncapsulation.None,
  providers: [MaestroService,ComprobanteService,ProductoService]
})
export class DialogComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<boolean> = new Subject();
  public detalle:any[]=[];
  public productos:any[]=[];

  constructor(private productoService:ProductoService,private fb: FormBuilder, private router: Router, private route: ActivatedRoute,private comprobanteService:ComprobanteService
    ,private dialog: MatDialog, public dialogRef: MatDialogRef<DialogComponent>, public maestroService: MaestroService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    console.log(this.data);
    if(this.data.comprobante){
      this.getDetalleComprobante();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.unsubscribe();
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  getDetalleComprobante(){
   this.maestroService.busy=this.comprobanteService.getDetalleComprobante(this.data.comprobante._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
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
                item.precioCompra= response.producto.precioCompra;
                item.ganancia = (response.producto.precioVenta-response.producto.precioCompra)*item.cantidad;
              } 
            },
          error =>{
          }
     );
    }

    
  PDF() {

    // let doc = new jsPDF('p', 'pt', 'a4',true);
    let doc:any={};
    doc  = new jsPDF('p', 'pt', 'a4',1);
    let totalPagesExp = "{total_pages_count_string}";

    let columns = ["N°", "PRODUCTO", "COLOR", "MARCA", "MATERIAL", "PRECIO COMPRA","PRECIO VENTA", "CANTIDAD","GANANCIA"];
    let rows: Array<object> = [];
    for (let i = 0; i < this.detalle.length; i++) {
      rows[i] = [];
      rows[i]["0"] = i + 1;
      rows[i]["1"] = this.detalle[i].nameProducto;
      rows[i]["2"] = this.detalle[i].color;
      rows[i]["3"] = this.detalle[i].marca;
      rows[i]["4"] = this.detalle[i].material;
      rows[i]["5"] = this.detalle[i].precioCompra;
      rows[i]["6"] = this.detalle[i].precio;
      rows[i]["7"] = this.detalle[i].cantidad;
      rows[i]["8"] = this.detalle[i].ganancia;
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
        6: { halign: 'right', width: 'wrap', columnWidth: 'linebreak' },
        7: { halign: 'right', width: 'wrap', columnWidth: 'linebreak' },
        8: { halign: 'right', width: 'wrap', columnWidth: 'linebreak' }
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
    doc.text(42, 145, `DNI: ${this.data.comprobante.dni}`);
    doc.text(42, 165, `Email: ${this.data.comprobante.email}`);
    doc.text(250, 165, `Cliente: ${this.data.comprobante.nombre}`);
    doc.text(42, 155, `Fecha: ${this.data.comprobante.fecha}`);
    doc.text(250, 155, `Total: S/. ${this.data.comprobante.total}`);
 

    doc.setDrawColor(0);
    let lastPosY = 620;

    lastPosY = lastPosY + 40;
    doc.text(40, lastPosY - 5, ["Nota: Los reportes deben firmarse por personal administrativo"]);
    lastPosY = lastPosY + 10;

    doc.rect(170, lastPosY, 100, 50);

    doc.setFontSize(10);
    doc.setFontStyle('normal');

    doc.rect(320, lastPosY, 100, 50);

    doc.setFontSize(10);
    doc.setFontStyle('normal');
    lastPosY = lastPosY + 60;

    doc.setTextColor(141, 141, 141);
    doc.text(205, lastPosY, "FIRMA");

    doc.setTextColor(141, 141, 141);
    doc.text(355, lastPosY, "FIRMA");

    doc.setFontStyle('bold');
    doc.setDrawColor(0);
    doc.roundedRect(40, 190, 513, 425, 3, 3);
    let str = "Página " + pdfResultsData.pageCount;
    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
      str = str + " de " + totalPagesExp;
    }
    doc.setTextColor(0, 0, 0);
    doc.text(str, 550, 800, "center");
  }

}



