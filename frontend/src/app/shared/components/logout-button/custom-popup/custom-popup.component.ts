import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-popup',
  imports: [CommonModule],
  templateUrl: './custom-popup.component.html',
  styleUrl: './custom-popup.component.css'
})
export class CustomPopupComponent {
  @Input() title: string = 'Dialog Title';
  @Input() width: string = 'max-w-lg'; 
  @Input() showActions: boolean = true;

  @Output() close = new EventEmitter<boolean>();

  onClose(result: boolean): void {
    this.close.emit(result);
  }
}
