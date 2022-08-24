import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() title: string | undefined;
  @Input() content: string | undefined;
  @Input() footer: string | undefined;
  @Input() closable: boolean = true;

  isActive: boolean = false;

  open(): void {
    this.isActive = true;
  }

  close(): void {
    this.isActive = false;
  }
}
