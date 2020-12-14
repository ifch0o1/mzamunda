import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TorrentListComponent } from './torrent-list.component';

describe('TorrentListComponent', () => {
  let component: TorrentListComponent;
  let fixture: ComponentFixture<TorrentListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TorrentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
