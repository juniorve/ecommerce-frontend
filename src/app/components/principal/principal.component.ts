import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MaestroService } from '../../services/maestro-service.service';
import { GLOBAL } from 'src/app/services/global';
import { Router } from '@angular/router';
declare const $: any;

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  @ViewChild('all') all: ElementRef;
  public url;
  constructor(public maestroService: MaestroService, private router: Router) {
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    if ($('.grid_sorting_button').length) {
      $('.grid_sorting_button').click(function () {
        // putting border fix inside of setTimeout because of the transition duration
        setTimeout(function () {
          if ($('.product_filter').length) {
            const products = $('.product_filter:visible');
            const wdth = window.innerWidth;
      
            // reset border
            products.each(function () {
              $(this).css('border-right', 'solid 1px #e9e9e9');
            });
      
            // if window width is 991px or less
      
            if (wdth < 480) {
              for (let i = 0; i < products.length; i++) {
                const product = $(products[i]);
                product.css('border-right', 'none');
              }
            } else if (wdth < 576) {
              if (products.length < 5) {
                const product = $(products[products.length - 1]);
                product.css('border-right', 'none');
              }
              for (let i = 1; i < products.length; i += 2) {
                const product = $(products[i]);
                product.css('border-right', 'none');
              }
            } else if (wdth < 768) {
              if (products.length < 5) {
                const product = $(products[products.length - 1]);
                product.css('border-right', 'none');
              }
              for (let i = 2; i < products.length; i += 3) {
                const product = $(products[i]);
                product.css('border-right', 'none');
              }
            } else if (wdth < 992) {
              if (products.length < 5) {
                const product = $(products[products.length - 1]);
                product.css('border-right', 'none');
              }
              for (let i = 3; i < products.length; i += 4) {
                const product = $(products[i]);
                product.css('border-right', 'none');
              }
            } else {
              if (products.length < 5) {
                const product = $(products[products.length - 1]);
                product.css('border-right', 'none');
              }
              for (let i = 4; i < products.length; i += 5) {
                const product = $(products[i]);
                product.css('border-right', 'none');
              }
            }
          }
        }, 500);

        $('.grid_sorting_button.active').removeClass('active');
        $(this).addClass('active');

        const selector = $(this).attr('data-filter');
        $('.product-grid').isotope({
          filter: selector,
          animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
          }
        });


        return false;
      });
    }
    this.all.nativeElement.click();
  }

  payProducts(sumaTotal) {
    const pagoTotal = sumaTotal + 10;
    this.router.navigate(['/pagar-total/' + pagoTotal]);
  }
}
