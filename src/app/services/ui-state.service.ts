import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {

  constructor() { }
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  setLoading(state: boolean) {
    this.loading.set(state);
  }

  setLoaded() {
    this.setLoading(false);
  }

  setError(message: string | null) {
    this.error.set(message);
  }

  getLoading() {
    return this.loading();
  }

  isLoading() {
    return this.loading();
  }

  getError() {
    return this.error();
  }

  hasError() {
    return this.error() !== null;
  }

  clearError() {
    this.error.set(null);
  }

  clearLoading() {
    this.loading.set(false);
  }

  reset() {
    this.clearError();
    this.clearLoading();
  }

}
