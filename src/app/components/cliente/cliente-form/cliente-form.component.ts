import { Component, OnInit, ViewChild } from '@angular/core';
import {
  PoDynamicFormComponent,
  PoModule,
  PoNotificationService, PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing
} from "@po-ui/ng-components";
import { Cliente } from "../../../model/cliente";
import { TelefoneCliente } from "../../../model/telefoneCliente";
import { ClienteService } from "../../../service/cliente.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TelefonePipePipe} from "../../../pipe/telefone-pipe.pipe";

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  standalone: true,
  imports: [
    PoModule,
    RouterLink,
    TelefonePipePipe,
  ],
  providers: [
    ClienteService
  ],
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
  @ViewChild('dynamicFormTelefoneCliente', { static: true }) dynamicFormTelefoneCliente?: PoDynamicFormComponent;
  @ViewChild('dynamicFormClienteForm', { static: true }) dynamicFormClienteForm?: PoDynamicFormComponent;

  cliente: Cliente = { telefoneClienteList: [] };
  telefoneCliente: TelefoneCliente = {};
  validateFields: Array<string> = ['nome'];
  fields: Array<any> = [];
  fieldsTelefone: Array<any> = [];
  isHideLoading = true;
  spacing: PoTableColumnSpacing = PoTableColumnSpacing.Medium;
  telefoneColumns: PoTableColumn[] = [];
  actionsTelefoneCliente: PoTableAction[] = [];

  constructor(private poNotification: PoNotificationService, private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.loadCliente();
  }

  ngOnInit() {
    this.buildFields();
    this.buildFieldsTelefone();
    this.telefoneColumns = this.defineColumnsTelefone();
    this.actionsTelefoneCliente = this.defineActionsTelefoneCliente();
  }
  defineActionsTelefoneCliente(): PoTableAction[] {
    return [
      { action: this.deleteTelefone.bind(this), icon: 'po-icon po-icon-minus-circle', label: '' }
    ];
  }

  loadCliente() {
    const paramId = this.activatedRoute.snapshot.paramMap.get('id');
    if (paramId) {
      this.isHideLoading = false;
      this.clienteService.getById(parseInt(paramId)).subscribe({
        next: (response) => {
          this.cliente = response;
        },
        error: (e) => {
          this.handleError(e, 'Erro ao buscar cliente');
          this.router.navigate(['/cliente']);
        },
        complete: () => {
          this.isHideLoading = true;
        }
      });
    }
  }

  buildFields() {
    this.fields = [
      { property: 'nome', label: 'Nome', required: true, gridColumns: 6, gridSmColumns: 12, className: 'custom-class', maxLength: 100, minLength: 11, showRequired: true },
      { property: 'endereco', label: 'Endereço', required: false, gridColumns: 6, gridSmColumns: 12, maxLength: 100 },
      { property: 'bairro', label: 'Bairro', required: false, gridColumns: 6, gridSmColumns: 12, maxLength: 100 },
    ];
  }

  buildFieldsTelefone() {
    this.fieldsTelefone = [
      { property: 'numero', label: 'Telefone', gridCollums: 12, required: true, minLength: 15, mask: '(99) 99999-9999' }
    ];
  }

  defineColumnsTelefone() {
    return [
      { property: 'id', label: 'Id', visible: false, width: '10%' },
      { property: 'numero', label: 'Telefone', width: '80%', required: true, type: 'cellTemplate', mask: '(99) 99999-9999' }
    ];
  }

  findTelefoneCliente(): Array<any> {
    return this.cliente.telefoneClienteList ? this.cliente.telefoneClienteList : [];
  }


  validateAndAddTelefone() {
    if (this.isFormAndTelefoneValid()) {
      this.addTelefoneToClienteList();
    }
  }

  isFormAndTelefoneValid() {
    if (this.dynamicFormTelefoneCliente?.form.invalid) return false;
    if (!this.telefoneCliente.numero) return false;
    if (this.cliente.telefoneClienteList?.some((item: any) => item.numero === this.telefoneCliente.numero)) {
      this.poNotification.information({ message: 'Telefone já está cadastrado', duration: 2000 });
      return false;
    }
    return true;
  }

  addTelefoneToClienteList() {
    // @ts-ignore
    this.cliente.telefoneClienteList = [...this.cliente.telefoneClienteList, this.telefoneCliente];
    this.telefoneCliente = {};
  }

  deleteTelefone(row: any) {
    this.cliente.telefoneClienteList = this.cliente.telefoneClienteList?.filter((item: any) => item.numero !== row.numero) || [];
  }

  validForm(): boolean {
    if (this.dynamicFormClienteForm?.form.invalid) {
      return true;
    }else{
      return false;
    }
  }

  saveCliente() {
    if (this.validForm()) {
      this.poNotification.error({ message: 'Preencha os campos obrigatórios', duration: 2000 });
      return;
    }
    this.isHideLoading = false;
    if (!this.cliente.id) {
      this.clienteService.save(this.cliente).subscribe({
        next: (v) => {
          this.poNotification.success({ message: 'Cliente salvo com sucesso', duration: 2000 });
        },
        error: (e) => {
          this.handleError(e, 'Erro ao salvar cliente');
        },
        complete: () => {
          this.isHideLoading = true;
          this.router.navigate(['/cliente']);
        }
      });
    } else {
      this.clienteService.update(this.cliente).subscribe({
        next: (v) => {
          this.poNotification.success({ message: 'Cliente alterado com sucesso', duration: 2000 });
        },
        error: (e) => {
          this.handleError(e, 'Erro ao alterar cliente');
        },
        complete: () => {
          this.isHideLoading = true;
          this.router.navigate(['/cliente']);
        }
      });
    }
  }

  handleError(e: any, defaultErrorMessage: string) {
    let erro = e.error.message ? e.error.message : defaultErrorMessage;
    this.poNotification.error({ message: decodeURIComponent(erro), duration: 2000 });
    this.isHideLoading = true;
  }

  protected readonly matchMedia = matchMedia;
}
