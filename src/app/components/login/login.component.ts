import { ProductoService } from './../../services/producto.service';
import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {Router,ActivatedRoute, Params} from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService,ProductoService]
})

export class LoginComponent implements OnInit{
  public title = '';
  public user: User;
  public errorMessage;
  public productos:any[]=[];

  public identity:any;
  public token;

  constructor(private _userService: UserService, private _route:ActivatedRoute,private _productoService:ProductoService,
              private _router:Router){

      this.user = new User(null,'','','','','','','','','');
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  
  getProductos()
  {        
        this._productoService.getTProductos().subscribe(
            response =>{
              console.log(response);
              if(!response.productos){
                }else{
                    this.productos= response.productos;

                    for(let item of this.productos){
                      if(item.cantidad<=item.stock_minimo){
                        console.log("entra1");
                        swal("Atención","Tiene bajo stock del producto "+item.descripcion
                        +" , stock actual "+item.cantidad +" unidades"
                        ,"warning")
                        console.log("entra");
                      }
                    }

                 }  
            },
          error =>{
          }
     );
    }

  loginUser(){
    console.log(this.user);

   // conseguir los datos del usuario identificado
    this._userService.loginUser(this.user).subscribe(
               response=>{
                  let identity =response.user;
                  this.identity = identity;
                  console.log(response.user);

                  if(!this.identity._id){
                    alert("El usuario no esta correctamente identificado");
                  }
                  else{
                        // crear elemento en el localstorage para tener al usuario en sesion
                        localStorage.setItem('identity', JSON.stringify(identity));
                        // conseguir el token para enviarselo a cada peticion HTTP
                        this._userService.loginUser(this.user,'true').subscribe(
                          response=>{
                            console.log(response);
                            let token =response.token;
                            this.token = token;

                            if(this.token.length <= 0){
                              alert("El token no se ha generado correctamente");
                            }
                            else{
                              // crear elemento en el localstorage para tener al token disponible
                              localStorage.setItem('token', token);
                                  
                              
                              //=========== BAJO STOCK
                              // this.getProductos();




                                      //  this._router.navigate(['/mant-proveedor']);
                                       this._router.navigate(['/']);
                                        this.user = new User(null,'','','','','','','','','');
                                      }
                              },

                              error=>{
                                   var erroMessage = <any>error;
                                   if(erroMessage!=null){
                                    var body = JSON.parse(error._body);
                                    this.errorMessage=body.message;
                                    console.log(error);
                                   }
                                }
                            );
                          }
                },

                error=>{
                     var erroMessage = <any>error;
                     if(erroMessage!=null){
                      var body = JSON.parse(error._body);
                      this.errorMessage=body.message;
                      console.log(error);
                     }
                }
      );
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity=null;
    this.token=null;
    this.errorMessage=null;

  }
}
