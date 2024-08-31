import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDetailsModalComponent } from './route-details-modal.component';

describe('RouteDetailsModalComponent', () => {
  let component: RouteDetailsModalComponent;
  let fixture: ComponentFixture<RouteDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
