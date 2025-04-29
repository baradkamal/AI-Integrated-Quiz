import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenrateGenaiQuizComponent } from './genrate-genai-quiz.component';

describe('GenrateGenaiQuizComponent', () => {
  let component: GenrateGenaiQuizComponent;
  let fixture: ComponentFixture<GenrateGenaiQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenrateGenaiQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenrateGenaiQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
