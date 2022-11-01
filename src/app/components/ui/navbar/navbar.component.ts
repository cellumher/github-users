import { Component, OnInit } from '@angular/core';
import { Repo } from 'src/app/interfaces/repo';
import { User } from 'src/app/interfaces/user';
import { GithupApiService } from 'src/app/service/githup-api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user!: User;
  username: string = "octokit";
  found!: boolean;
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
    this.searchInfo();
  }

  searchInfo(): void {
    if (!this.username || this.username.toLocaleLowerCase() === this.user?.login.toLocaleLowerCase()) return;
    this.loadingUser = true;
    this.loadingRepos = true;
    this.repos = [];
    this.allLanguages = new Set();
    this.searchUser();
  }

  searchUser(): void {
    this.service.getUser(this.username)
      .subscribe(
        user => {
          this.user = user;
          this.found = true;
          this.errorUser = null;
          this.username = "";
          this.reposRemaining = true;
          this.currentPage = 1;
          this.loadingUser = false;
          this.searchRepos();
        },
        error => {
          this.found = false;
          this.errorUser = error;
          this.reposRemaining = false;
          this.currentPage = 1;
          this.loadingUser = false;
        });
  }

  searchRepos(): void {
    this.loadingRepos = true;
    this.service.getRepos(this.user?.login, this.currentPage)
      .subscribe(
        repos => {
          console.log(repos);
          if (repos.length < 30) this.reposRemaining = false;
          repos.map(repo => {
            this.service.getLanguages(repo.full_name)
              .subscribe(
                result => {
                  repo.languages = result;
                  repo.languages_array = Object.keys(result);
                  // guardar todos los lenguajes usados en un set para los filtros
                  repo.languages_array.map(language => this.allLanguages.add(language));
                  return repo;
                },
                error => this.errorRepo = error);
          })
          this.loadingRepos = false;
          this.repos = [...this.repos, ...repos];
          this.errorRepo = null;
          this.currentPage++;
        },
        error => {
          this.errorRepo = error;
          this.reposRemaining = false;
          this.loadingRepos = false;
        }
      )
  }

  alternarTema(): void {
    document.body.classList.toggle('dark-theme');
  }

}
