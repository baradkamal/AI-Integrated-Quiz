import { Component } from '@angular/core';
import { CustomPopupComponent } from "../../../../shared/components/logout-button/custom-popup/custom-popup.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-users',
  imports: [CustomPopupComponent,CommonModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {
  isDialogOpen = false;
  dialogTitle = 'Default Title';

  openDialog(title: string) {
    this.dialogTitle = title;
    this.isDialogOpen = true;
  }

  closeDialog(result: boolean) {
    this.isDialogOpen = false;
    console.log('Dialog result:', result);
  }
}
