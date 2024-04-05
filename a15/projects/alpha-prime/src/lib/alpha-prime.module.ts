import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// PRIME NG
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

// ALPHA
import { AlphaAddButtonComponent } from './alpha-add-button/alpha-add-button.component';
import { AlphaDebugTagComponent } from './alpha-debug-tag/alpha-debug-tag.component';

@NgModule({
  declarations: [
    AlphaAddButtonComponent,
    AlphaDebugTagComponent
  ],
  imports: [
    CommonModule,

    // PRIME
    ButtonModule,
    TooltipModule
  ],
  exports: [
    // PRIME
    ButtonModule,
    TooltipModule,
    // ALPHA
    AlphaAddButtonComponent,
    AlphaDebugTagComponent
  ]
})
export class AlphaPrimeModule { }
