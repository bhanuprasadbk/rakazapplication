import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CustomerAdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /* Start: Below are the methods for setting up the configuration */
  createCustomerType(data: any) {
    return this.http.post(`${this.apiUrl}customer-types`, data);
  }

  getCustomerTypes() {
    return this.http.get(`${this.apiUrl}customer-types`);
  }

  getCustomerTypeById(id: string) {
    return this.http.get(`${this.apiUrl}customer-types/${id}`);
  }

  updateCustomerType(id: string, data: any) {
    return this.http.put(`${this.apiUrl}customer-types/${id}`, data);
  }

  deleteCustomerType(ids: number[]) {
    return this.http.delete(`${this.apiUrl}customer-types`, { body: { ids } });
  }

  /* End: Methods for setting up the configuration */


  /* Start: Below are the methods for Countries, States and Cities */

  getCountries() {
    return this.http.get(`${this.apiUrl}countries`);
  }

  getStates(countryId: number) {
    return this.http.get(`${this.apiUrl}states/country/${countryId}`);
  }

  getCities(stateId: number) {
    return this.http.get(`${this.apiUrl}cities/state/${stateId}`);
  }

  getCurrencies() {
    return this.http.get(`${this.apiUrl}currencies`);
  }

  

  /* End: Methods for Countries, States and Cities */

  /* Start: Below are the methods for managing the Customer Admins */

  createCustomer(data: any) {
    return this.http.post(`${this.apiUrl}customers`, data);
  }

  getCustomers(data: any) {
    return this.http.post(`${this.apiUrl}getcustomers`, data);
  }

  getCustomerById(id: any) {
    return this.http.get(`${this.apiUrl}customers/${id}`);
  }

  updateCustomer(id: any, data: any) {
    return this.http.put(`${this.apiUrl}customers/${id}`, data);
  }

  deleteCustomer(id: any) {
    return this.http.delete(`${this.apiUrl}customers/${id}`);
  }

  /* End: Methods for managing the Customer Admins */
 

  /* Start: Below are the methods for managing the Subscriptions */
  createSubscription(data: any) {
    return this.http.post(`${this.apiUrl}subscriptions`, data);
  }

  getSubscriptions(data: any) {
    return this.http.post(`${this.apiUrl}get-subscriptions`, data);
  }

  getSubscriptionById(id: any) {
    return this.http.get(`${this.apiUrl}subscriptions/${id}`);
  }

  updateSubscription(id: any, data: any) {
    return this.http.put(`${this.apiUrl}subscriptions/${id}`, data);
  }

  deleteSubscription(data: any) {
    return this.http.delete(`${this.apiUrl}subscriptions`, { body: data });
  }

  /* End: Methods for managing the Subscriptions */


  /* Start: Below are the methods for managing the Sensor Groups */

  createSensorGroup(data: any) {
    return this.http.post(`${this.apiUrl}sensors-group`, data);
  }

  getSensorGroups() {
    return this.http.get(`${this.apiUrl}sensors-group`);
  }

  getSensorGroupById(id: any) {
    return this.http.get(`${this.apiUrl}sensors-group/${id}`);
  }

  updateSensorGroup(id: any, data: any) {
    return this.http.put(`${this.apiUrl}sensors-group/${id}`, data);
  }

  deleteSensorGroup(data: any,id: any) {
    return this.http.delete(`${this.apiUrl}sensors-group/${id}`,{body:data});
  } 

  /* End: Methods for managing the Sensor Groups */ 

}
