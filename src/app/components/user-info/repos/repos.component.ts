import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Repo } from 'src/app/interfaces/repo';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.css']
})
export class ReposComponent implements OnInit {

  @Input() repos!: Repo[];
  @Input() filter!: string;
  @Input() language!: string;
  reposShown!: Repo[];
  reposEmpty: boolean = false;
  error: any;
  sortingParameters = {
    name: {
      asc: true // true porque inicialmente está ordenado ASC
    },
    stars: {
      asc: false
    },
    lastSort: {
      column: "name",
      asc: false
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any): void {
    this.repeatLastSort();
    this.filterRepos();

  }

  filterRepos(): void {
    if (!!this.filter && this.filter !== "") {
      this.reposShown = this.repos.filter(
        repo => {
          return repo.name.toLocaleLowerCase().includes(this.filter.toLocaleLowerCase())
        })
    } else {
      this.reposShown = this.repos;
    }

    if (!!this.language && this.language !== "Todos") {
      this.reposShown = this.reposShown.filter(
        repo => {
          return repo.languages_array?.includes(this.language);
        }
      )
    }

    if (!this.reposShown || this.reposShown.length === 0) {
      this.reposEmpty = true;
      this.error = {
        error: {
          message: "No repos found"
        },
        status: null
      }
    } else {
      this.reposEmpty = false;
      this.error = null;
    }
  }

  sortReposByName(): void {
    if (this.sortingParameters.name.asc) this.repos.sort(this.compareNameDesc);
    else this.repos.sort(this.compareNameAsc);

    this.sortingParameters.lastSort = {
      column: "name",
      asc: this.sortingParameters.name.asc
    }

    // preparar la siguiente ordenacion
    this.sortingParameters.name.asc = !this.sortingParameters.name.asc
    this.sortingParameters.stars.asc = false;
  }

  sortReposByStars(): void {
    if (this.sortingParameters.stars.asc) this.repos.sort(this.compareStarsDesc);
    else this.repos.sort(this.compareStarsAsc);

    this.sortingParameters.lastSort = {
      column: "stars",
      asc: this.sortingParameters.stars.asc
    }

    // preparar la siguiente ordenacion
    this.sortingParameters.stars.asc = !this.sortingParameters.stars.asc
    this.sortingParameters.name.asc = false;
  }

  repeatLastSort(): void {
    if (this.sortingParameters.lastSort.column === "name") {
      this.sortingParameters.name.asc = this.sortingParameters.lastSort.asc;
      this.sortReposByName();
    } else {
      this.sortingParameters.stars.asc = this.sortingParameters.lastSort.asc;
      this.sortReposByStars();
    }
  }

  compareNameAsc(a: Repo, b: Repo): number {
    return a.name.localeCompare(b.name);
  }

  compareNameDesc(a: Repo, b: Repo): number {
    return -a.name.localeCompare(b.name);
  }

  compareStarsAsc(a: Repo, b: Repo): number {
    return b.stargazers_count - a.stargazers_count
  }

  compareStarsDesc(a: Repo, b: Repo): number {
    return a.stargazers_count - b.stargazers_count
  }

  // https://sankhadip.medium.com/how-to-sort-table-rows-according-column-in-angular-9-b04fdafb4140

}
