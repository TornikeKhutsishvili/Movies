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

  setError(message: string | null) {
    this.error.set(message);
  }
}
