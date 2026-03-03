import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChequebookComponent } from './admin-chequebook.component';

describe('AdminChequebookComponent', () => {
  let component: AdminChequebookComponent;
  let fixture: ComponentFixture<AdminChequebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminChequebookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminChequebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
