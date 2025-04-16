import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserServiceService } from '../../../../core/services/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addnewuser',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addnewuser.component.html',
  styleUrls: ['./addnewuser.component.css']
})
export class AddnewuserComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: ['', [Validators.required, Validators.min(1)]],
      isAdmin: [false],
      Status: ['active']
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const formData = new FormData();
    const formValue = this.userForm.value;

    // Append form fields to FormData
    Object.keys(formValue).forEach(key => {
      formData.append(key, formValue[key]);
    });

    // Append file if selected
    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    this.userService.createUserAdmin(formData).subscribe({
      next: (response) => {
        this.success = 'User created successfully!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/manageusers']);
        }, 2000);
      },
      error: (error) => {
        this.error = error.message || 'Failed to create user';
        this.loading = false;
      }
    });
  }
}
