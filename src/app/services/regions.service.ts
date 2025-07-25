import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Regions } from '../models/regions.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RegionsService {

  private apiKey = [
    'nYKWjq7aJRd5Q8xKkUyFSGGtMPfuBO2JCk8OUia8',
    't0XNBuNEaL4lMfCVvx90ks41SrlQlWynqX5gqGB3',
    'EFCY2h2VghuMcuVW60TvMyWN9glnfkDhg1QKgvrk',
  ];


  private baseUrl = 'https://api.watchmode.com/v1';
  private readonly lastSwitchKey = 'api_key_last_switch';
  private readonly currentIndexKey = 'api_key_index';


  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}



  // workaround for the issue with the API key switching every 25 days
  // This method will switch the API key every 25 days

  private getApiKey(): string {
    let index = 0;

    if (isPlatformBrowser(this.platformId)) {
      const now = new Date();
      const lastSwitchStr = localStorage.getItem(this.lastSwitchKey);
      const currentIndexStr = localStorage.getItem(this.currentIndexKey);

      index = currentIndexStr ? parseInt(currentIndexStr, 10) : 0;
      const lastSwitch = lastSwitchStr ? new Date(lastSwitchStr) : new Date(0);

      const diffInMs = now.getTime() - lastSwitch.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24); // ms → days

      if (diffInDays >= 25) {
        index = (index + 1) % this.apiKey.length;
        localStorage.setItem(this.currentIndexKey, index.toString());
        localStorage.setItem(this.lastSwitchKey, now.toISOString());
      }
    }

    return this.apiKey[index];
  }

  // get regions
  getAllRegions(): Observable<Regions[]> {
    const apiKey = this.getApiKey();
    const url = `${this.baseUrl}/regions/?apiKey=${apiKey}`;
    return this.http.get<Regions[]>(url).pipe(
      map((regions) => regions.slice(0, 60))
    );
  }

}
