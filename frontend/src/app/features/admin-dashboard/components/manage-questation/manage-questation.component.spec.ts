import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageQuestationComponent } from './manage-questation.component';

describe('ManageQuestationComponent', () => {
  let component: ManageQuestationComponent;
  let fixture: ComponentFixture<ManageQuestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageQuestationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageQuestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
