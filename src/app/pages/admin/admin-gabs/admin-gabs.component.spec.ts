import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGabsComponent } from './admin-gabs.component';

describe('AdminGabsComponent', () => {
  let component: AdminGabsComponent;
  let fixture: ComponentFixture<AdminGabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
