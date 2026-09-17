import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { HeaderComponent } from '../../composants/header/header.component';

import { LoaderComponent } from '../../composants/loader/loader.component';

import { MenuComponent } from '../../composants/menu/menu.component';

@Component({
  imports: [RouterOutlet, HeaderComponent, LoaderComponent, MenuComponent],
  selector: 'app-page-dashboard',
  templateUrl: './page-dashboard.component.html',
  styleUrls: ['./page-dashboard.component.scss']
})
export class PageDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
