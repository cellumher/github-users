import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  @Output()
  public onChange = new EventEmitter<Set<string>>();

  debouncer: Subject<string> = new Subject<string>();
  debouncerSubscription = this.debouncer.pipe(
    filter(username => username !== ''),
    debounceTime(500),
    distinctUntilChanged(),
  )

  user?: User;
  found?: boolean;
  errorUser!: any;
  errorRepo!: any;
  repos: Repo[] = [];
  reposRemaining: boolean = true;
  currentPage: number = 1;
  allLanguages: Set<string> = new Set();

  showTokenInput = false;
  loadingUser = true;
  loadingRepos = true;

  constructor(
    private service: GithupApiService) {
  }

  ngOnInit(): void {
    this.debouncerSubscription.subscribe(username => this.searchUser(username))

    this.debouncer.next('octokit');
  }


  searchUser(username: string): void {
    this.loadingUser = true;
    this.loadingRepos = true;
    this.service.getUser(username)
      .pipe(
        distinctUntilKeyChanged('login'),
        tap(() => {
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
            this.loadingRepos = false;
          },
          complete: () => this.searchRepos()
        })
  }

  searchRepos(): void {
    this.loadingRepos = true;
    this.service.getRepos(this.user!.login, this.currentPage)
      .pipe(
        map<Repo[], Repo[]>(repos => {
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
                this.errorRepo = error;
              }

            })
            return repo;
          })
          return repos;
        }),
        delay(500),
        tap(() => {
          this.onChange.emit(this.allLanguages);
          this.loadingUser = false;
          this.loadingRepos = false;
        })
      ).subscribe({
        next: repos => {
          this.repos = [...this.repos, ...repos];
          this.errorRepo = null;
          this.currentPage++;
        },
      });
  }

  checkRepos(): void {
    if (!this.reposRemaining) return;
    this.searchRepos();
  }


  toggleTheme(): void {
    document.body.classList.toggle('dark-theme');
  }

  saveToken(token: string): void {
    this.toggleTokenInput();
    if (token === "") return;
    this.service.saveToken(token);
    if (!this.found) {
      this.debouncerSubscription
        .subscribe(username => this.searchUser(username))
      this.debouncer.next('octokit');
    }
  }

  toggleTokenInput() {
    this.showTokenInput = !this.showTokenInput;
  }

}
