import {Component, Input, OnInit} from '@angular/core';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {NgIf} from "@angular/common";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'alpha-prime-debug-tag',
  standalone: true,
  imports: [
    NgIf,
    TooltipModule
  ],
  templateUrl: './alpha-prime-debug-tag.component.html',
  styleUrl: './alpha-prime-debug-tag.component.css'
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

