import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsViewerComponent } from './projects-viewer.component';

describe('ProjectsViewerComponent', () => {
  let component: ProjectsViewerComponent;
  let fixture: ComponentFixture<ProjectsViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
