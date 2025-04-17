import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../../../../core/services/user-service.service';

import { Router, RouterLink } from '@angular/router';
import { CustomPopupComponent } from '../../../../shared/components/logout-button/custom-popup/custom-popup.component';
import { ImageUrlService } from '../../../../core/services/image-url.service';
import { FormsModule } from '@angular/forms';

interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  profileImage: string;
  age: number;
  isAdmin: boolean;
  Status: string;
}

interface PaginatedResponse {
  users: User[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, CustomPopupComponent,RouterLink, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  error: string | null = null;
  selectedUser: User | null = null;
  showPopup = false;
  
  // Dialog properties
  isDialogOpen = false;
  dialogTitle = '';
  dialogMessage = '';
  dialogType = '';
  editForm: any = null;

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private userService: UserServiceService,
    private router: Router,
    private imageUrlService: ImageUrlService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.error = null;

    this.userService.getUsersAdmin(this.currentPage, this.itemsPerPage).subscribe({
      next: (response: PaginatedResponse) => {
        // Transform the profile image URLs
        this.users = response.users.map(user => ({
          ...user,
          profileImage: this.imageUrlService.getFullImageUrl(user.profileImage)
        }));
        this.totalItems = response.totalCount;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.error = 'Failed to load users';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleClass(isAdmin: boolean): string {
    return isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  }

  showUserDetails(user: User) {
    this.selectedUser = {
      ...user,
      profileImage: this.imageUrlService.getFullImageUrl(user.profileImage)
    };
    this.dialogTitle = user.name;
    this.dialogType = 'view';
    this.isDialogOpen = true;
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.dialogTitle = 'Edit User';
    this.dialogType = 'edit';
    this.editForm = {
      name: user.name,
      email: user.email,
      username: user.username,
      age: user.age,
      Status: user.Status,
      isAdmin: user.isAdmin,
      profileImage: null // For file upload
    };
    this.isDialogOpen = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.editForm.profileImage = file;
    }
  }

  closeDialog(result: boolean) {
    if (result) {
      if (this.dialogType === 'edit' && this.editForm && this.selectedUser) {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('name', this.editForm.name);
        formData.append('email', this.editForm.email);
        formData.append('username', this.editForm.username);
        formData.append('age', this.editForm.age.toString());
        formData.append('Status', this.editForm.Status);
        formData.append('isAdmin', this.editForm.isAdmin.toString());
        
        if (this.editForm.profileImage) {
          formData.append('profileImage', this.editForm.profileImage);
        }

        this.userService.updateUserAdmin(this.selectedUser._id, formData).subscribe({
          next: () => {
            this.loadUsers();
            this.error = null;
          },
          error: (error: any) => {
            console.error('Error updating user:', error);
            this.error = 'Failed to update user';
          }
        });
      } else if (this.dialogType === 'delete' && this.selectedUser) {
        this.userService.deleteUserAdmin(this.selectedUser._id).subscribe({
          next: () => {
            this.loadUsers();
            this.error = null;
          },
          error: (error: any) => {
            console.error('Error deleting user:', error);
            this.error = 'Failed to delete user';
          }
        });
      } else if (this.dialogType === 'status' && this.selectedUser) {
        const newStatus = this.selectedUser.Status === 'active' ? 'inactive' : 'active';
        this.userService.updateUserAdmin(this.selectedUser._id, { Status: newStatus }).subscribe({
          next: () => {
            this.loadUsers();
            this.error = null;
          },
          error: (error: any) => {
            console.error('Error updating user status:', error);
            this.error = 'Failed to update user status';
          }
        });
      }
    }
    this.isDialogOpen = false;
    this.selectedUser = null;
    this.editForm = null;
    this.dialogType = '';
  }

  deleteUser(userId: string) {
    this.selectedUser = this.users.find(u => u._id === userId) || null;
    this.dialogTitle = 'Delete User';
    this.dialogMessage = 'Are you sure you want to delete this user?';
    this.dialogType = 'delete';
    this.isDialogOpen = true;
  }

  updateUserStatus(userId: string, newStatus: string) {
    this.selectedUser = this.users.find(u => u._id === userId) || null;
    this.dialogTitle = 'Change Status';
    this.dialogMessage = 'Are you sure you want to change the status of this user?';
    this.dialogType = 'status';
    this.isDialogOpen = true;
  }

  // Pagination methods
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  onItemsPerPageChange(limit: number) {
    this.itemsPerPage = limit;
    this.currentPage = 1; // Reset to first page
    this.loadUsers();
  }
}
