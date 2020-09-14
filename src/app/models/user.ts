export class User {
    constructor(
        public dni: number,
        public name: string,
        public surname: string,
        public ciudad: string,
        public direccion: string,
        public telefono: string,
        public email: string,
        public password: string,
        public role: string,
        public imagen: string
    ) {

    }
}
