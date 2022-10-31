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
  username: string = "celiapdg";
  found!: boolean;
  errorUser!: any;
  errorRepo!: any;
  repos!: Repo[];
  allLanguages: Set<string> = new Set();

  constructor(
    private service: GithupApiService) {
  }

  ngOnInit(): void {
    this.searchInfo();
  }

  searchInfo(): void {
    if (!this.username) return;
    this.allLanguages = new Set();
    this.searchUser();
    this.searchRepos();
  }

  searchUser(): void {
    this.service.getUser(this.username)
      .subscribe(
        user => {
          this.user = user;
          this.found = true;
          this.errorUser = null;
          this.username = "";
        },
        error => {
          this.found = false;
          this.errorUser = error;
        });
  }

  searchRepos(): void {
    this.service.getRepos(this.username)
      .subscribe(
        repos => {
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
          this.repos = repos;
          this.errorRepo = null;
          console.log(repos);
        },
        error => {
          this.errorRepo = error;
        }
      )
  }

  alternarTema(): void {
    document.body.classList.toggle('dark-theme');
  }

}
