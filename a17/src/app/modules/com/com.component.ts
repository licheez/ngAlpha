import { Component } from '@angular/core';
import {ComHeaderComponent} from "./header/com-header/com-header.component";
import {DividerModule} from "primeng/divider";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-com',
  standalone: true,
  imports: [
    ComHeaderComponent,
    DividerModule,
    RouterOutlet
  ],
  templateUrl: './com.component.html',
  styleUrl: './com.component.scss'
})
export class ComComponent {

}
