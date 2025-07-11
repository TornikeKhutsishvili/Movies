import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Actors } from '../models/actors.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ActorsService {

  private apiKey = [
    'nYKWjq7aJRd5Q8xKkUyFSGGtMPfuBO2JCk8OUia8',
    'EFCY2h2VghuMcuVW60TvMyWN9glnfkDhg1QKgvrk',
    't0XNBuNEaL4lMfCVvx90ks41SrlQlWynqX5gqGB3',
  ];

  private baseUrl = 'https://api.watchmode.com/v1';
  private readonly lastSwitchKey = 'api_key_last_switch';
  private readonly currentIndexKey = 'api_key_index';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}


  private getApiKey(): string {
    let index = 0;

    if (isPlatformBrowser(this.platformId)) {
      const now = new Date();
      const lastSwitchStr = localStorage.getItem(this.lastSwitchKey);
      const currentIndexStr = localStorage.getItem(this.currentIndexKey);

      index = currentIndexStr ? parseInt(currentIndexStr, 10) : 0;
      const lastSwitch = lastSwitchStr ? new Date(lastSwitchStr) : new Date(0);

      const oneMonthLater = new Date(lastSwitch);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

      if (now >= oneMonthLater) {
        index = (index + 1) % this.apiKey.length;
        localStorage.setItem(this.currentIndexKey, index.toString());
        localStorage.setItem(this.lastSwitchKey, now.toISOString());
      }
    }

    return this.apiKey[index];
  }



  // 
  // private readonly people = [
  //   7110004,
  //   710203130,
  //   73333445,
  //   710203131,
  //   710203132,
  //   710203133,
  //   710203134,
  //   710203135
  // ];

  // // get Actors
  // getAllActors(): Observable<Actors[]> {
  //   const apiKey = this.getApiKey();

  //   const requests = this.people.map(id => {
  //     const url = `${this.baseUrl}/person/${id}?apiKey=${apiKey}`;
  //     return this.http.get<Actors>(url);
  //   });

  //   return forkJoin(requests);
  // }
  // 



  // get Actors
  getAllActors(): Observable<Actors[]> {
    const apiKey = this.getApiKey();
    const url = `${this.baseUrl}/person/7110004?apiKey=${apiKey}`;
    return this.http.get<Actors>(url).pipe(
      map((res) => [res])
    );
  }

  // get Actor by id
  getActorById(id: number): Observable<Actors> {
    const apiKey = this.getApiKey();
    const url = `${this.baseUrl}/person/${id}?apiKey=${apiKey}`;
    return this.http.get<Actors>(url);
  }

}
