import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDisplayerComponent } from './account-displayer.component';

describe('AccountDisplayerComponent', () => {
  let component: AccountDisplayerComponent;
  let fixture: ComponentFixture<AccountDisplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountDisplayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
