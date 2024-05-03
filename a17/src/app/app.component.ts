import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {HeaderComponent} from "./header/header.component";

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    NgIf,
    HeaderComponent
  ],
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'a17';
  ready = false;
  constructor() { }

  ngOnInit() {
    this.ready = true;
  }

}
