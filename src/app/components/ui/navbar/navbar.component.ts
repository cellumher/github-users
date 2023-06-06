import { Component, OnInit } from '@angular/core';
import { Subject, Subscription, debounceTime, delay, distinctUntilChanged, distinctUntilKeyChanged, filter, forkJoin, map, mergeMap, switchMap, tap } from 'rxjs';
import { Repo } from 'src/app/interfaces/repo';
import { User } from 'src/app/interfaces/user';
import { GithupApiService } from 'src/app/service/githup-api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  debouncer: Subject<string> = new Subject<string>();

  user?: User;
  found?: boolean;
  errorUser!: any;
  errorRepo!: any;
  repos: Repo[] = [];
  reposRemaining: boolean = true;
  currentPage: number = 1;
  allLanguages: Set<string> = new Set();

  loadingUser = false;
  loadingRepos = false;

  constructor(
    private service: GithupApiService) {
  }

  ngOnInit(): void {
    this.debouncer
      .pipe(
        filter(username => username !== ''),
        debounceTime(500),
        distinctUntilChanged(),
      ).subscribe(username => this.searchUser(username))

    this.debouncer.next('octokit');
  }


  searchUser(username: string): void {
    this.service.getUser(username)
      .pipe(
        distinctUntilKeyChanged('login'),
        tap(() => {
          this.loadingUser = true;
          this.loadingRepos = true;
          this.repos = [];
          this.allLanguages = new Set();
        }),
        delay(500),
      ).subscribe(
        {
          next: user => {
            this.user = user;
            this.found = true;
            this.errorUser = null;
            this.reposRemaining = true;
            this.currentPage = 1;

          },
          error: error => {
            this.found = false;
            this.errorUser = error;
            this.reposRemaining = false;
            this.currentPage = 1;
            this.loadingUser = false;
          },
          complete: () => this.searchRepos()
        })
  }

  searchRepos(): void {
    this.loadingRepos = true;
    this.service.getRepos(this.user!.login, this.currentPage)
      .pipe(
        map<Repo[], void>(repos => {
          if (repos.length < 30) this.reposRemaining = false;
          repos.map(repo => {
            this.service.getLanguages(repo.full_name).subscribe({
              next: result => {
                repo.languages = result;
                repo.languages_array = Object.keys(result);
                // guardar todos los lenguajes usados en un set para los filtros
                repo.languages_array.map(language => this.allLanguages.add(language));
              },
              error: error => {
                this.errorRepo = error;
                this.reposRemaining = false;
                this.loadingUser = false;
                this.loadingRepos = false;
                this.errorRepo = error
              }

            })
          })
          this.repos = [...this.repos, ...repos];
        }),

      ).subscribe(() => {
        this.loadingUser = false;
        this.loadingRepos = false;
        this.errorRepo = null;
        this.currentPage++;
      });
  }




  alternarTema(): void {
    document.body.classList.toggle('dark-theme');
  }

}
