import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-popup.component.html',
  styleUrl: './custom-popup.component.css'
})
export class CustomPopupComponent {
  @Input() title: string = 'Dialog Title';
  @Input() width: string = 'max-w-lg';
  @Input() showActions: boolean = true;
  @Input() confirmButtonText: string = 'Save';
  @Input() cancelButtonText: string = 'Cancel';
  @Input() confirmButtonClass: string = 'bg-indigo-600 hover:bg-indigo-700';
  @Input() cancelButtonClass: string = 'border border-gray-300 hover:bg-gray-50';
  @Input() hideDefaultButtons: boolean = false;

  @Output() close = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();

  onClose(result: boolean): void {
    this.close.emit(result);
  }

  onSave(): void {
    this.save.emit(true);
  }
}
