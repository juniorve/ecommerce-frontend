export class Producto {
    constructor(
      public nombre:string,
      public precioCompra:number,
      public precioVenta:number,
      public stock_minimo:number,
      public stock_maximo:number,
      public cantidad:number,
      public material:string,
      public envioInternacional:string,
      public descripcion:string,
      public descripcion1:string,
      public descripcion2:string,
      public descripcion3:string,
      public tipo:string,
      public imagen:string,
      public color: string,
      public marca: string,
      public user: string,
      public proveedor: string
    ){}
  }
  