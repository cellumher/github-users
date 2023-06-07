import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('0.5s ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('0.5s ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    ),
  ]
})

export class UserInfoComponent implements OnInit {

  filterRepos: string = "";
  filterLanguage: string = "Todos";

  constructor() { }

  ngOnInit(): void {
  }

  setLanguageSelector(languages: Set<string>): void {
    console.log(this.filterLanguage);
    console.log(languages);
    if (this.filterLanguage === "Todos" ||
      languages.has(this.filterLanguage)) return;

    this.filterLanguage = "Todos";

  }

}
