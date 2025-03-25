import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeshboardComponent } from './user-deshboard.component';

describe('UserDeshboardComponent', () => {
  let component: UserDeshboardComponent;
  let fixture: ComponentFixture<UserDeshboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDeshboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDeshboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
