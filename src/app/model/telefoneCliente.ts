export class TelefoneCliente {
  id?: number | null;
  numero?: string | null;
  cliente?: TelefoneCliente| null;

  constructor(id?: number, numero?: string, cliente?: TelefoneCliente) {
    this.id = id;
    this.numero = numero;
    this.cliente = cliente;
  }
}
