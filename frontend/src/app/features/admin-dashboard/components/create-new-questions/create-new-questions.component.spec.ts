import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewQuestionsComponent } from './create-new-questions.component';

describe('CreateNewQuestionsComponent', () => {
  let component: CreateNewQuestionsComponent;
  let fixture: ComponentFixture<CreateNewQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
