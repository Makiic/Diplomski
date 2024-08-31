import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ACtivateProfileComponent } from './activate-profile.component';

describe('ACtivateProfileComponent', () => {
  let component: ACtivateProfileComponent;
  let fixture: ComponentFixture<ACtivateProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ACtivateProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ACtivateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
