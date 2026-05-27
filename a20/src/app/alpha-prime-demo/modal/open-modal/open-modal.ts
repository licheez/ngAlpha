import {Component, inject} from '@angular/core';
import {AlphaPrimeDebugTagComponent, AlphaPrimeModalService} from 'AlphaPrime';
import {MyModal} from '../my-modal/my-modal';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-open-modal',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    Button
  ],
  templateUrl: './open-modal.html',
  styleUrl: './open-modal.scss',
})
export class OpenModal {
    // DEFINES
    private readonly anchor = 'OpenModal';

    // INJECTION
    private readonly mMs = inject(AlphaPrimeModalService);

    // VIEW EVENTS
    protected onOpenModal(): void {
      this.mMs.openModal(
        MyModal,
        this.anchor,
        'MyModal',
        {width: '75%', height: '75%'}).subscribe(m =>
          m.init(summary => console.log(summary)));
    }
}
