export interface Products {
    totalItems: number;
    totalPages: number;
    currentPages: number;
    pageSize: number;
    data: Product[];
}

export interface Product {
    idProducto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    estado: number;
}
