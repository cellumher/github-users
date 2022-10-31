import { Component, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  filterRepos: string = "";
  filterLanguage: string = "Todos";

  constructor() { }

  ngOnInit(): void {
  }

}
