import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayQuizComponentComponent } from './play-quiz-component.component';

describe('PlayQuizComponentComponent', () => {
  let component: PlayQuizComponentComponent;
  let fixture: ComponentFixture<PlayQuizComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayQuizComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayQuizComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
