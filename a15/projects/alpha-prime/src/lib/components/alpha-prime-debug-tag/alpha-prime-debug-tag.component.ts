import {Component, Input, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {TooltipModule} from "primeng/tooltip";
import {AlphaPrimeService} from "../../services/alpha-prime.service";

@Component({
  selector: 'alpha-prime-debug-tag',
  standalone: true,
  templateUrl: './alpha-prime-debug-tag.component.html',
  styleUrls: ['./alpha-prime-debug-tag.component.css'],
  imports: [
    NgIf,
    TooltipModule
  ]
})
export class AlphaPrimeDebugTagComponent implements OnInit{

  visible = false;
  @Input() tag = '';

  constructor(private mPs: AlphaPrimeService) { }

  ngOnInit(): void {
    if (this.mPs.isProduction) {
      localStorage.setItem('alphaHideDebugTag', 'true');
    }
    const hide = localStorage.getItem('alphaHideDebugTag');
    this.visible = hide == null || hide == 'false';
  }

  static hide(hidden: boolean): void {
    if (hidden) {
      localStorage.setItem('alphaHideDebugTag', 'true');
    } else {
      localStorage.removeItem('alphaHideDebugTag');
    }
    window.location.reload();
  }

  static get hidden(): boolean {
    const hide = localStorage.getItem('alphaHideDebugTag');
    return hide == 'true';
  }

}
