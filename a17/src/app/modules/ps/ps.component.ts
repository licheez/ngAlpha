import { Component } from '@angular/core';
import {PsHeaderComponent} from "./header/ps-header.component";
import {DividerModule} from "primeng/divider";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-ps',
  standalone: true,
  imports: [
    PsHeaderComponent,
    DividerModule,
    RouterOutlet
  ],
  templateUrl: './ps.component.html',
  styleUrl: './ps.component.scss'
})
export class PsComponent {

}
