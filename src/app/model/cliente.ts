import {TelefoneCliente} from "./telefoneCliente";

export class Cliente {
  id?: number| null;
  nome?: string;
  endereco?: string | null;
  bairro?: string | null;
  telefoneClienteList?: TelefoneCliente[];

  constructor(id?: number, nome?: string, endereco?: string | null, bairro?: string | null, telefoneClienteList?: TelefoneCliente[]) {
    this.id = id;
    this.nome = nome;
    this.endereco = endereco;
    this.bairro = bairro;
    this.telefoneClienteList = telefoneClienteList;
  }
}
