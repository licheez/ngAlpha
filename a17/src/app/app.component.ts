import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AlphaTsService} from "../../projects/alpha-ts/src/lib/alpha-ts.service";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  ready = false;

  title = 'a17';

  constructor(
    private mTs: AlphaTsService) {
  }

  ngOnInit() {
    const tcUpdateUrl = environment.apiHost + '/getTranslationCacheUpdate';
    this.mTs.init(tcUpdateUrl).subscribe({
        next: tsStatus => {
          console.log(tsStatus);
          this.ready = true;
        }
      });
  }

}
