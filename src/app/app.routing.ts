import { ListSugerenciasComponent } from './components/list-sugerencias/list-sugerencias.component';
import { VentasComponent } from './components/ingresos/ventas/ventas.component';
import { PagarTotalComponent } from './components/pagar-total/pagar-total.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { ShowProductoComponent } from './components/show-producto/show-producto.component';
import { EditProductoComponent } from './components/producto/edit-producto/edit-producto.component';
import { ListProductoComponent } from './components/producto/list-producto/list-producto.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RegisterComponent } from './components/register/register.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { EditProveedorComponent } from './components/proveedor/edit-proveedor/edit-proveedor.component';
import { MantProveedorComponent } from './components/proveedor/mant-proveedor/mant-proveedor.component';
import { NewProveedorComponent } from './components/proveedor/new-proveedor/new-proveedor.component';
import { ListProveedorComponent } from './components/proveedor/list-proveedor/list-proveedor.component';
import { ViewProveedorComponent } from './components/proveedor/view-proveedor/view-proveedor.component';
import { AdmProductoComponent } from './components/producto/adm-producto/adm-producto.component';
import { NewProductoComponent } from './components/producto/new-producto/new-producto.component';
import { GanananciasComponent } from './components/ingresos/ganancias/ganancias.component';
import { SugerenciasComponent } from './components/sugerencias/sugerencias.component';
import { ComprasComponent } from './components/compras/compras.component';

const appRoutes: Routes = [
    {
    path: '',
    component: SidebarComponent,
    children: [
      {path:'edit-proveedor/:id', component: EditProveedorComponent},
      {path:'mant-proveedor', component: MantProveedorComponent},
      {path:'new-proveedor', component: NewProveedorComponent},
      {path:'list-proveedor', component: ListProveedorComponent},
      {path:'view-proveedor/:id', component: ViewProveedorComponent},
      //resumen
      {path:'ganancias', component: GanananciasComponent},
      {path:'ventas', component: VentasComponent},
      {path:'list-sugerencias', component: ListSugerenciasComponent},
      //productos
      {path:'adm-producto', component: AdmProductoComponent},
      {path:'edit-producto/:id', component: EditProductoComponent},
      {path:'new-producto', component: NewProductoComponent},
      {path:'list-producto', component: ListProductoComponent},
      { path: 'compras', component: ComprasComponent }
     ]
  },
  { path: 'categorias', component: CategoriasComponent },
  // { path: '', component: PrincipalComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'principal', component: PrincipalComponent },
  { path: 'show-producto/:id', component: ShowProductoComponent },
  { path: 'pagar-total/:total', component: PagarTotalComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'sugerencias', component: SugerenciasComponent },
  { path: '', redirectTo: '/principal', pathMatch: 'full' }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

