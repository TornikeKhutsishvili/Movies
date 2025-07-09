import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Actors } from '../models/actors.model';

@Injectable({
  providedIn: 'root'
})
export class ActorsService {
  private http = inject(HttpClient);

  // private apiKey = [
  //   'nYKWjq7aJRd5Q8xKkUyFSGGtMPfuBO2JCk8OUia8',
  //   'EFCY2h2VghuMcuVW60TvMyWN9glnfkDhg1QKgvrk',
  //   't0XNBuNEaL4lMfCVvx90ks41SrlQlWynqX5gqGB3',
  // ];

  // tornikexucishvili0@gmail.com
  // private apiKey = 'EFCY2h2VghuMcuVW60TvMyWN9glnfkDhg1QKgvrk';

  // tornike.khutsishvili347@eab.tsu.edu.ge
  // private apiKey = 't0XNBuNEaL4lMfCVvx90ks41SrlQlWynqX5gqGB3';

  // torkokhutso4@gmail.com
  // private apiKey = 'nYKWjq7aJRd5Q8xKkUyFSGGtMPfuBO2JCk8OUia8';
  // private baseUrl = 'https://api.watchmode.com/v1';

  // getAllActors(): Observable<Actors[]> {
  //   const url = `${this.baseUrl}/search/?apiKey=${this.apiKey}&search_field=name&search_value=&types=person`;
  //   return this.http.get<any>(url).pipe(
  //     map(res => res.results as Actors[])
  //   );
  // }

  // getActorById(id: number): Observable<Actors> {
  //   const url = `${this.baseUrl}/person/${id}?apiKey=${this.apiKey}`;
  //   return this.http.get<Actors>(url);
  // }
}
