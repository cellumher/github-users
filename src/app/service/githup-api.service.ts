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

  getRepos(username: string): Observable<Repo[]> {
    return this.http.get<Repo[]>(this.baseURL + "users/" + username + "/repos",
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
