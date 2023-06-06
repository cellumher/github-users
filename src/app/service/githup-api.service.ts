import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { Repo } from '../interfaces/repo';

@Injectable({
  providedIn: 'root'
})

export class GithupApiService {

  baseURL = "https://api.github.com/"
  headers = {
    headers: {
      authorization: "token TOKEN"
    }
  }

  constructor(
    private http: HttpClient
  ) { }


  getUser(username: string): Observable<User> {
    let url = `${this.baseURL}users/${username}`;
    return this.http.get<User>(url, this.headers);
  }

  getRepos(username: string, page: number): Observable<Repo[]> {
    let url = `${this.baseURL}users/${username}/repos?page=${page}`;
    return this.http.get<Repo[]>(url, this.headers);
  }

  getLanguages(fullName: string): Observable<object> {
    let url = `${this.baseURL}repos/${fullName}/languages`;
    return this.http.get<object>(url, this.headers);
  }

}
