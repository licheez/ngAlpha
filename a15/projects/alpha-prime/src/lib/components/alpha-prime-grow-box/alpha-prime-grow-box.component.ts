import {Component, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {InputTextareaModule} from "primeng/inputtextarea";

@Component({
  selector: 'alpha-prime-grow-box-box',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgStyle,
    InputTextareaModule
  ],
  templateUrl: './alpha-prime-grow-box.component.html',
  styleUrls: ['./alpha-prime-grow-box.component.css'],

  //see https://angular.io/guide/animations

  animations: [
    trigger('thin-thick', [
      state('thin', style({
        height: '6px'
      })),
      state('thick', style({
      })),
      transition('thin => thick', [
        animate('200ms ease-in')
      ]),
      transition('thick => thin', [
        animate('200ms')
      ])
    ])
  ]
})
export class AlphaPrimeGrowBoxComponent {

  isCollapsed = true;
  isAnimating = false;
  keepExpanded = false;

  @Input()
  set expanded(expanded: boolean) {
    this.isCollapsed = !expanded;
    this.keepExpanded = expanded;
  }
  @Input()
  set collapsed(collapsed: boolean) {
    this.isCollapsed = collapsed;
  }
  @Input() divClass = '';
  @Input() divStyle = { 'padding': '2px', 'border-radius': '2px', 'border-width': '1px', 'border-style': 'dotted' };

  onHover(): void {
    this.isCollapsed = false;
  }

  onLeave(): void {
    if (this.keepExpanded) {
      return;
    }
    this.isCollapsed = true;
  }

  onAnimStart(): void {
    this.isAnimating = true;
  }

  onAnimDone(): void {
    this.isAnimating = false;
  }

}
