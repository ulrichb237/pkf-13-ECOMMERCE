import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoaderService } from './service/loader.service';

@Component({
  selector: 'app-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class.hidden]="!loaderService.visible()">
      <div class="loader-overlay">
        @if (loaderService.visible()) {
          <div class="loader"></div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {

  constructor(public loaderService: LoaderService) { }

}
