import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequebookComponent } from './chequebook.component';

describe('ChequebookComponent', () => {
  let component: ChequebookComponent;
  let fixture: ComponentFixture<ChequebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChequebookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
