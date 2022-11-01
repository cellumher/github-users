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

  constructor(
    private http: HttpClient
  ) { }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(this.baseURL + "users/" + username,
      {
        headers: {
          authorization: "token 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"
        }
      });
  }

  getRepos(username: string, page: number): Observable<Repo[]> {
    return this.http.get<Repo[]>(this.baseURL + "users/" + username + "/repos?page=" + page,
      {
        headers: {
          authorization: "token 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"
        }
      });
  }

  getLanguages(fullName: string): Observable<object> {
    return this.http.get<object>(this.baseURL + "repos/" + fullName + "/languages",
      {
        headers: {
          authorization: "token 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"
        }
      });
  }

}
