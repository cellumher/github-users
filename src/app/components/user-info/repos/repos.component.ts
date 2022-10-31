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

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any): void {
    this.filterRepos();

  }

  filterRepos(): void {
    if (!!this.filter && this.filter != "") {
      this.reposShown = this.repos.filter(
        repo => {
          return repo.name.toLocaleLowerCase().includes(this.filter.toLocaleLowerCase())
        })
    } else {
      this.reposShown = this.repos;
    }

    if (!!this.language && this.language != "Todos") {
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

  // https://sankhadip.medium.com/how-to-sort-table-rows-according-column-in-angular-9-b04fdafb4140

}
