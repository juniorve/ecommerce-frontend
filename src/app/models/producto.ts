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
      public tipo:string,
      public imagen:string,
      public color: string,
      public marca: string,
      public user: string,
      public proveedor: any
    ){}
  }
  