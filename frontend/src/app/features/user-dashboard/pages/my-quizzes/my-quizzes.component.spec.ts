import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQuizzesComponent } from './my-quizzes.component';

describe('MyQuizzesComponent', () => {
  let component: MyQuizzesComponent;
  let fixture: ComponentFixture<MyQuizzesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyQuizzesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
