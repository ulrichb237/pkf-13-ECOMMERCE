import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVentesComponent } from './page-ventes.component';

describe('PageVentesComponent', () => {
  let component: PageVentesComponent;
  let fixture: ComponentFixture<PageVentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageVentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
