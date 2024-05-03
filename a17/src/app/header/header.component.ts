import { Component } from '@angular/core';
import { AlphaPrimeDebugTagComponent } from "@pvway/alpha-prime";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [
    AlphaPrimeDebugTagComponent
  ]
})
export class HeaderComponent {

  tagsHidden = AlphaPrimeDebugTagComponent.hidden;

  onToggleTags() {
    this.tagsHidden = !this.tagsHidden;
    AlphaPrimeDebugTagComponent.hide(this.tagsHidden);
  }

  onPs(): void {
    console.log('ps');
  }
}
