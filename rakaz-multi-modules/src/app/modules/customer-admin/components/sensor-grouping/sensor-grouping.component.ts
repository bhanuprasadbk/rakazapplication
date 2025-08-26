import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/shared/services/toast.service';
import { CustomerAdminService } from '../../services/customer-admin.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { SensorGroupMappingFormComponent } from '../../modals/sensor-group-mapping-form/sensor-group-mapping-form.component';

@Component({
  selector: 'app-sensor-grouping',
  templateUrl: './sensor-grouping.component.html',
  styleUrls: ['./sensor-grouping.component.scss']
})
export class SensorGroupingComponent implements OnInit {

  columnDefs: ColDef[] = [
    { headerName: 'Penalty Duration', field: 'penaltyDuration', sortable: true, filter: true },
    { headerName: 'Frequency Count', field: 'frequencyCount', sortable: true, filter: true },
    { headerName: 'Frequency Duration', field: 'frequencyDuration', sortable: true, filter: true },
    { headerName: 'Warning Count', field: 'warningCount', sortable: true, filter: true },
    { headerName: 'Warning Duration', field: 'warningDuration', sortable: true, filter: true },
    { headerName: 'Reset By', field: 'resetBy', sortable: true, filter: true },
    { headerName: 'Latitude', field: 'latitude', sortable: true, filter: true },
    { headerName: 'Longitude', field: 'longitude', sortable: true, filter: true },
    {
      headerName: 'Actions',
      cellRenderer: () => `
        <button class="btn btn-sm btn-primary">Edit</button>
        <button class="btn btn-sm btn-danger ms-1">Delete</button>
      `
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };

  rowData: any[] = [
    { penaltyDuration: '5 mins', frequencyCount: 3, frequencyDuration: '15 mins', warningCount: 1, warningDuration: '5 mins', resetBy: 'User 1', latitude: '12.971599', longitude: '77.594566' },
    { penaltyDuration: '10 mins', frequencyCount: 5, frequencyDuration: '20 mins', warningCount: 2, warningDuration: '10 mins', resetBy: 'User 2', latitude: '13.082680', longitude: '80.270721' },
    { penaltyDuration: '15 mins', frequencyCount: 2, frequencyDuration: '12 mins', warningCount: 0, warningDuration: '0 mins', resetBy: 'User 3', latitude: '17.385044', longitude: '78.486671' },
    { penaltyDuration: '8 mins', frequencyCount: 4, frequencyDuration: '18 mins', warningCount: 1, warningDuration: '5 mins', resetBy: 'User 4', latitude: '19.075983', longitude: '72.877655' },
    { penaltyDuration: '20 mins', frequencyCount: 6, frequencyDuration: '25 mins', warningCount: 3, warningDuration: '15 mins', resetBy: 'User 5', latitude: '22.572645', longitude: '88.363892' },
    { penaltyDuration: '12 mins', frequencyCount: 3, frequencyDuration: '14 mins', warningCount: 1, warningDuration: '6 mins', resetBy: 'User 6', latitude: '28.704060', longitude: '77.102493' },
    { penaltyDuration: '7 mins', frequencyCount: 5, frequencyDuration: '19 mins', warningCount: 2, warningDuration: '8 mins', resetBy: 'User 7', latitude: '11.016844', longitude: '76.955833' },
    { penaltyDuration: '9 mins', frequencyCount: 4, frequencyDuration: '17 mins', warningCount: 1, warningDuration: '4 mins', resetBy: 'User 8', latitude: '23.022505', longitude: '72.571365' },
    { penaltyDuration: '6 mins', frequencyCount: 2, frequencyDuration: '10 mins', warningCount: 0, warningDuration: '0 mins', resetBy: 'User 9', latitude: '15.299326', longitude: '74.123993' },
    { penaltyDuration: '18 mins', frequencyCount: 6, frequencyDuration: '30 mins', warningCount: 4, warningDuration: '20 mins', resetBy: 'User 10', latitude: '26.912434', longitude: '75.787270' }
  ];

  pageSize = 5;
  pageSizeSelector = [5, 10, 20];
  private gridApi!: GridApi;

  constructor(private modalService: NgbModal, private customerAdminService: CustomerAdminService, private toastService: ToastService) {}

  ngOnInit(): void {
    
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onQuickFilterChanged(event: any) {
    const filterValue = event.target.value;
    if (this.gridApi) {
      // this.getSensorGrouping(filterValue);     
    } else {
      console.warn('Grid API not available yet.');
    }
  }

  onPaginationChanged() {
    // pagination logic if needed
  }

  openSensorGroupingModal(type: string, formData?: any) {
    // Add scroll lock class to body
    document.body.classList.add('modal-open-scroll-lock');

    const modalRef = this.modalService.open(SensorGroupMappingFormComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      windowClass: 'custom-modal-class modal-1024px',
    });

    modalRef.componentInstance.mode = type;
    modalRef.componentInstance.data = formData || null;

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          console.log('Sensor group created/updated.');
          // this.getCustomerAdmins();
        }
        // Remove scroll lock
        document.body.classList.remove('modal-open-scroll-lock');
      })
      .catch(() => {
        // Remove scroll lock even on dismiss
        document.body.classList.remove('modal-open-scroll-lock');
      });
  }

}
