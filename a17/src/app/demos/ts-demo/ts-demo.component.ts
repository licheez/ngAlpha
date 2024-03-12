import { Component } from '@angular/core';
import {AlphaTsService} from "../../../../projects/alpha-ts/src/lib/alpha-ts.service";

@Component({
  selector: 'app-ts-demo',
  standalone: true,
  imports: [],
  templateUrl: './ts-demo.component.html',
  styleUrl: './ts-demo.component.scss'
})
export class TsDemoComponent {

  titleLit: string;

  constructor(ts: AlphaTsService) {
    this.titleLit = ts.getTr('demoTs.title');
  }

}
