import { ProductoService } from './../../services/producto.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert';
import { MaestroService } from '../../services/maestro-service.service';
import { GLOBAL } from '../../services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
declare var $:any

@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css'],
  providers:[ProductoService]
})
export class ShowProductoComponent implements OnInit,OnDestroy {

  public comentarioForm:FormGroup;
  public url;
  public idProducto;
  public producto:any={};
  private ngUnsubscribe: Subject<boolean> = new Subject();
  public comentarios=[
    {ruta:"assets/images/productos/foto1.jpg",name:"Manuela Cervantes",email:"manuela@gmail.com",fecha:"27 febrero 2019",descripcion:"Compre el juego de cocina hace poco, pero la calidad es increible y ha sido la mejor elección."},
    {ruta:"assets/images/productos/foto2.jpg",name:"Andrea Sotomayo",email:"andrea@gmail.com",fecha:"12 mayo 2019",descripcion:"Decidi aprovechar la oferta y el hermoso diseño me enamoro, soy la envidia entre mis amigas."}
  ]
  constructor(private router:Router,private route:ActivatedRoute, private fb:FormBuilder,public maestroService:MaestroService,private productoService:ProductoService) { 
   this.newForm();
   this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['id']) {
        this.idProducto = params['id'];
        console.log(this.idProducto);
        this.getProducto(this.idProducto);
      }
    });

    this.showCantidad();
    this.changeOption();
    this.initQuantity();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.unsubscribe();
  }

  showCantidad(){
    var span_Text = document.getElementById("quantity_value").innerText; 
    console.log(span_Text);
  }
  getProducto(idProducto){
    console.log(idProducto);
   this.maestroService.busy= this.productoService.getProducto(idProducto).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      res=>{
          console.log(res);
          this.producto=res.producto;
          this.viewImage(this.url+'get-img-producto/'+this.producto.imagen)
      },
      error=>{

      }
    );
  }

  payProducts(sumaTotal){
    console.log("suma"+parseFloat(sumaTotal));
    let pagoTotal=sumaTotal+10;
    this.router.navigate(['/pagar-total/'+pagoTotal]);
  }
  
  addProducto(producto: any) {
    producto.cantidadCarrito=parseFloat(document.getElementById("quantity_value").innerText); 
    // this.showCantidad();
    // swal("Producto agregado","El producto fue agregado al carrito","success");

    console.log(producto);
    this.maestroService.addCarrito(producto);
  }
  
  addComentario(){
    let comentario:any={};
    comentario.name=this.comentarioForm.controls["name"].value;
    comentario.fecha=this.comentarioForm.controls["fecha"].value;
    comentario.descripcion=this.comentarioForm.controls["descripcion"].value;
    comentario.ruta='assets/images/productos/blog_2.jpg';
    this.comentarios.push(comentario);
    console.log(this.comentarios);
    swal("Comentario realizado","Su comentario se registro exitosamente",{icon:"success",
    closeOnClickOutside: false
    }).then(
      (comentarioRegister)=>{
        if(comentarioRegister){
          this.newForm();
        }
      }
    );
  }

  viewImage(ruta){
    console.log(ruta);
		if($('.single_product_thumbnails ul li').length)
		{
			var thumbs = $('.single_product_thumbnails ul li');
			var singleImage = $('.single_product_image_background');

			thumbs.each(function()
			{
				var item = $(this);
				// console.log(item);
				item.on('click', function()
				{
					thumbs.removeClass('active');
					item.addClass('active');
					var img = item.find('img').data('image');
					console.log(ruta);
					singleImage.css('background-image', 'url(' + ruta + ')');
				});
			});
		}	
  }

  newForm(){
    this.comentarioForm = this.fb.group({
      name:["",Validators.required],
      email:["",Validators.required],
      fecha:["20 de junio 2019"],
      descripcion:["",Validators.required]
    });
  }

  changeOption(){
    if($('.tabs').length)
    {
      var tabs = $('.tabs li');
      var tabContainers = $('.tab_container');

      tabs.each(function()
      {
        var tab = $(this);
        var tab_id = tab.data('active-tab');

        tab.on('click', function()
        {
          if(!tab.hasClass('active'))
          {
            tabs.removeClass('active');
            tabContainers.removeClass('active');
            tab.addClass('active');
            $('#' + tab_id).addClass('active');
          }
        });
      });
  }
  }

  initQuantity()
	{
    if($('.user_star_rating li').length)
		{
			var stars = $('.user_star_rating li');

			stars.each(function()
			{
				var star = $(this);

				star.on('click', function()
				{
					var i = star.index();

					stars.find('i').each(function()
					{
						$(this).removeClass('fa-star');
						$(this).addClass('fa-star-o');
					});
					for(var x = 0; x <= i; x++)
					{
						$(stars[x]).find('i').removeClass('fa-star-o');
						$(stars[x]).find('i').addClass('fa-star');
					};
				});
			});
    }
    

		if($('.plus').length && $('.minus').length)
		{
			var plus = $('.plus');
			var minus = $('.minus');
			var value = $('#quantity_value');

			plus.on('click', function()
			{
				var x = parseInt(value.text());
				value.text(x + 1);
			});

			minus.on('click', function()
			{
				var x = parseInt(value.text());
				if(x > 1)
				{
					value.text(x - 1);
				}
			});
		}
	}


}
