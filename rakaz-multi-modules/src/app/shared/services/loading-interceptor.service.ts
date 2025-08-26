import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ToastService } from './toast.service';

@Injectable()
export class LoadingInterceptorService implements HttpInterceptor {

  private activeRequests = 0;

  constructor(private toastService: ToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.activeRequests++;
    
    // Show loading indicator for the first request
    if (this.activeRequests === 1) {
      this.showLoading();
    }

    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--;
        
        // Hide loading indicator when all requests are complete
        if (this.activeRequests === 0) {
          this.hideLoading();
        }
      })
    );
  }

  private showLoading(): void {
    // You can implement loading indicator logic here
    // For example, using a service to show a spinner
    console.log('Loading started');
  }

  private hideLoading(): void {
    // You can implement loading indicator logic here
    // For example, using a service to hide a spinner
    console.log('Loading finished');
  }
} 