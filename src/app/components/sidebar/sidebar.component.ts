import { UserService } from './../../services/user.service';
import { Component, OnInit, Output, AfterViewInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArgumentType } from '@angular/compiler/src/core';
import { EventEmitter } from 'protractor';

declare var $: any;
declare var jQuery: any;


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService]
})

export class SidebarComponent implements OnInit {
  public title = 'salir';
  public errorMessage;

  public identity;
  public token;
  public nameUser: String;

  constructor(private _userService: UserService, private _router: Router, private _route: ActivatedRoute) {
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    if (this.identity) {
      this.nameUser = this.identity.name;
    }
    this.render();
  }

  render() {
    jQuery(function ($) {

      $('.sidebar-dropdown > a').click(function () {
        $('.sidebar-submenu').slideUp(200);
        if ($(this).parent().hasClass('active')) {
          $('.sidebar-dropdown').removeClass('active');
          $(this).parent().removeClass('active');
        } else {
          $('.sidebar-dropdown').removeClass('active');
          $(this).next('.sidebar-submenu').slideDown(200);
          $(this).parent().addClass('active');
        }

      });

      $('#toggle-sidebar').click(function () {
        $('.page-wrapper').toggleClass('toggled');
      });
      const themes = 'chiller-theme ice-theme cool-theme light-theme green-theme spicy-theme purple-theme';
      $('[data-theme]').click(function () {
        $('.page-wrapper').removeClass(themes);
        $('.page-wrapper').addClass($(this).attr('data-theme'));
      });

      if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('.sidebar-content').mCustomScrollbar({
          axis: 'y',
          autoHideScrollbar: true,
          scrollInertia: 300
        });
        $('.sidebar-content').addClass('desktop');

      }
    });
  }


  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this.errorMessage = null;
  }

}
