import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-boutton-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="btn btn-primary" (click)="clickEvent.emit()">
      Nouveau
    </button>
  `,
  styleUrls: ['./boutton-action.component.scss']
})
export class BouttonActionComponent {

  isNouveauVisible = input(true);
  isExporterVisible = input(true);
  isImporterVisible = input(true);

  clickEvent = output<void>();

}
