import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { NotfoundComponent } from './notfound.component'

describe('NotfoundComponent', () => {
  let component: NotfoundComponent;
  let fixture: ComponentFixture<NotfoundComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotfoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotfoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   it('should display a title', waitForAsync(() => {
    const titleText = fixture.nativeElement.querySelector('p').textContent;
    expect(titleText).toEqual('notfound works!');
  }));
});
