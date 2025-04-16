import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewuserComponent } from './addnewuser.component';

describe('AddnewuserComponent', () => {
  let component: AddnewuserComponent;
  let fixture: ComponentFixture<AddnewuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddnewuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddnewuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
