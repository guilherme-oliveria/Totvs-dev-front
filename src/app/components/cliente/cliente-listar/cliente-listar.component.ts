import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {
  PoModalComponent,
  PoModule,
  PoNotificationService,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing
} from "@po-ui/ng-components";
import {Router, RouterLink} from "@angular/router";
import {Cliente} from "../../../model/cliente";
import {ClienteService} from "../../../service/cliente.service";

@Component({
  selector: 'app-cliente-listar',
  standalone: true,
  imports: [
    PoModule,
    FormsModule,
    RouterLink,
  ],
  providers: [
    ClienteService
  ],
  templateUrl: './cliente-listar.component.html',
  styleUrl: './cliente-listar.component.css'
})
export class ClienteListarComponent implements OnInit {
  spacing: PoTableColumnSpacing = PoTableColumnSpacing.Medium;
  clienteColumns: PoTableColumn[] = [];
  clienteData: any[] = [];
  tableActions: PoTableAction[] = [];
  clientToDelete?: Cliente;

  @ViewChild(PoModalComponent, { static: true }) deleteModal!: PoModalComponent;

  constructor(private clientService: ClienteService, private route: Router, private notificationService: PoNotificationService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.clienteColumns = this.defineColumns();
      this.tableActions = this.defineActions();
      this.refreshTable();
    }, 1000);
  }

  defineColumns(): PoTableColumn[] {
    return [
      { property: 'nome', type: 'string', label: 'Nome' },
      { property: 'endereco', type: 'string', label: 'Endereço' },
      { property: 'bairro', type: 'string', label: 'Bairro' },
    ];
  }

  defineActions(): PoTableAction[] {
    return [
      { action: this.editClient.bind(this), icon: 'po-icon po-icon-edit', label: 'Alterar' },
      { action: this.openDeleteModal.bind(this), icon: 'po-icon po-icon-user-delete', label: 'Excluir' },
    ];
  }

  refreshTable(): void {
    this.clientService.getAll().subscribe({
      next: (res: any) => {
        this.clienteData = res;
      },
      error: (ex) => {
        this.notificationService.error({ message:  ex.error.message, duration: 2000 });
      }
    });
  }

  editClient(cliente: any): void {
    this.route.navigate([`/cliente/${cliente.id}/alterar`]);
  }

  openDeleteModal(clienteDelet: any): void {
    this.clientToDelete = clienteDelet;
    this.deleteModal.open();
  }

  confirmDelete(): void {
    if (!this.clientToDelete) return;
    let id     = this.clientToDelete?.id ? this.clientToDelete.id : 0;
    this.clientService.delete(id).subscribe({
      next: () => {
        this.notificationService.success({ message: 'Cliente excluído com sucesso!', duration: 2000 });
        this.refreshTable();
      },
      error: (ex) => {
        this.notificationService.error({ message: ex.error.message, duration: 2000 });
      },
      complete: () => {
        this.deleteModal.close();
        this.clientToDelete = undefined;
      }
    });
  }

  cancelDelete(): void {
    this.deleteModal.close();
    this.clientToDelete = undefined;
  }
}
