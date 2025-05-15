import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieSearchService {
  private apiKey = 'EFCY2h2VghuMcuVW60TvMyWN9glnfkDhg1QKgvrk';
  private baseUrl = 'https://api.watchmode.com/v1';

  constructor(private http: HttpClient) {}

  searchMovies(title: string): Observable<any> {
    const params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('search_field', 'name')
      .set('search_value', title);

    return this.http.get(`${this.baseUrl}/search/`, { params });
  }
}