import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleVenteComponent } from './nouvelle-vente.component';

describe('NouvelleVenteComponent', () => {
  let component: NouvelleVenteComponent;
  let fixture: ComponentFixture<NouvelleVenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NouvelleVenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvelleVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
