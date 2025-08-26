import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LocationPickerComponent } from '../location-picker/location-picker.component';

@Component({
  selector: 'app-sensor-group-mapping-form',
  templateUrl: './sensor-group-mapping-form.component.html',
  styleUrls: ['./sensor-group-mapping-form.component.scss']
})
export class SensorGroupMappingFormComponent implements OnInit {
  form!: FormGroup;
  type: 'create' | 'edit' = 'create';

  // Dropdown options
  sensorTypes = ['Air', 'Water', 'Temperature'];
  sensorGroupNameOptions: { [key: string]: string[] } = {
    Air: ['Air Sensor Group', 'Air Quality Group'],
    Water: ['Water Sensor Group', 'Water Quality Group'],
    Temperature: ['Temperature Sensor Group']
  };

  customers = [
    { id: 1, name: 'hamad' },
    { id: 2, name: 'amal' },
    { id: 3, name: 'majid' },
    { id: 4, name: 'saeed' }
  ];

  devices = [
    { id: '7899654651321', make: 'Make1', model: 'Model1' },
    { id: '6576732787877', make: 'Make2', model: 'Model2' }
  ];

  showSensorParams = false;
  sensorParamsEnabled:boolean = false;
  selectedField: 'latitude' | 'longitude' | null = null;
  currentStep = 1;
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // this.form = this.fb.group({
    //   sensorType: ['', Validators.required],
    //   sensorGroupName: ['', Validators.required],
    //   customerName: ['', Validators.required],
    //   deviceId: ['', Validators.required],
    //   deviceMake: ['', Validators.required],
    //   deviceModel: ['', Validators.required],
    //   deviceLatitude: ['', Validators.required],
    //   deviceLongitude: ['', Validators.required],
    //   sensorParameters: this.fb.array([]),

    //   // Step 2 fields
    // fineAmount: ['', Validators.required],
    // frequency: ['', Validators.required],
    // frequencyPer: ['', Validators.required],
    // warningPer: ['', Validators.required],
    // warning: ['', Validators.required],
    // penaltyPercent: ['', Validators.required],
    // penaltyPer: ['', Validators.required],
    // resetType: ['violation', Validators.required]
    // });

    this.form = this.fb.group({
      step1: this.fb.group({
        sensorType: ['', Validators.required],
        sensorGroupName: ['', Validators.required],
        customerName: ['', Validators.required],
        deviceId: ['', Validators.required],
        deviceMake: ['', Validators.required],
        deviceModel: ['', Validators.required],
        deviceLatitude: ['', Validators.required],
        deviceLongitude: ['', Validators.required],
        sensorParameters: this.fb.array([])
        
      }),
      step2: this.fb.group({
        fineAmount: ['', Validators.required],
        frequency: ['', Validators.required],
        frequencyPer: ['', Validators.required],
        warningPer: ['', Validators.required],
        warning: ['', Validators.required],
        penaltyPercent: ['', Validators.required],
        penaltyPer: ['', Validators.required],
        resetType: ['violation', Validators.required]
      })
    });

    // Reset sensor group name when type changes
    this.form.get('step1.sensorType')?.valueChanges.subscribe(type => {
      this.form.get('step1.sensorGroupName')?.setValue('');
      this.loadSensorParameters(type);
    });
  }

  // Create sensor parameter form group
  createSensorParameter(paramName: string = ''): FormGroup {
    return this.fb.group({
      sensorParameter: [paramName, Validators.required],
      minThresholdLimit: [0, Validators.required],
      maxThresholdLimit: [0, Validators.required]
    });
  }

  // Get sensor parameters form array
  // get sensorParametersArray(): FormArray {
  //   return (this.form.get('step1.sensorParameters') as FormArray) || this.fb.array([]);
  // }

  get sensorParametersArray(): FormArray {
    return (this.form.get('step1.sensorParameters') as FormArray);
  }

  // Load default parameters for sensor type
  loadSensorParameters(sensorType: string) {
    this.sensorParametersArray.clear();
    if (sensorType === 'Air') {
      ['Pm10', 'Ozone', 'Nitrogendioxide', 'SulfurDioxide', 'Pm25'].forEach(p => {
        this.sensorParametersArray.push(this.createSensorParameter(p));
      });
    }
    // Add logic for Water/Temperature if needed
  }

    // toggleSensorParams(checked: boolean) {
    //   console.log('Toggled:-------', checked);
    //   // Update your form array or model here
    //   this.showSensorParams = checked;
    //   this.form.get('step1')?.get('sensorParameters')?.setValue(checked);
    //   // this.form.get('step1.sensorParameters')?.setValue(checked);
    //   this.sensorParamsEnabled = checked;
    //   console.log('sensorParametersArray:-------', this.sensorParametersArray);
    //   console.log('sensorParamsEnabled:-------', this.sensorParamsEnabled);
    // }

    toggleSensorParams(checked: boolean) {
      this.showSensorParams = checked;
      this.sensorParamsEnabled = checked;
    
      const sensorArray = this.form.get('step1.sensorParameters') as FormArray;
    
      // if (checked) {
      //   // Add one parameter by default
      //   sensorArray.clear();
      //   sensorArray.push(this.fb.group({
      //     sensorParameter: [''],
      //     minThresholdLimit: [''],
      //     maxThresholdLimit: ['']
      //   }));
      // } else {
      //   // Clear all parameters if unchecked
      //   sensorArray.clear();
      // }
    
      console.log('sensorParametersArray:-------', this.sensorParametersArray);
    }
    
  submitForm() {
    if (this.form.invalid) {
      this.toastService.showError('Please fill all required fields');
      return;
    }
    console.log(this.form.value);
    this.toastService.showSuccess('Sensor group mapping saved successfully');
    this.activeModal.close(this.form.value);
  }

openLocationModal(field: 'latitude' | 'longitude') {
  this.selectedField = field;
  // Example: open your NgbModal here
  const modalRef = this.modalService.open(LocationPickerComponent, {
    size: 'lg',
    backdrop: 'static',
    windowClass: 'custom-modal-class',
  });

  modalRef.result.then(
    (coords) => {
      console.log('Coords:', coords);
      if (coords && this.selectedField) {
        this.form.patchValue({ step1: { deviceLatitude: coords.lat, deviceLongitude: coords.lng } });
        // if (this.selectedField === 'latitude') {
        //   this.form.patchValue({ deviceLatitude: coords.lat });
        // } else {
        //   this.form.patchValue({ deviceLongitude: coords.lng });
        // }
      }
    },
    () => {}
  );
}

goNext() {
  if (this.currentStep === 1 && this.form.get('step1')?.invalid) {
    this.toastService.showError('Please fill required fields in Step 1');
    return;
  }
  this.currentStep = 2;
}

goBack() {
  this.currentStep = 1;
}

  
}
