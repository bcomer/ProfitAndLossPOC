import { TestBed, inject } from '@angular/core/testing';

import { PnLDataService } from './pnl-data.service';

describe('PnLDataServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PnLDataService]
    });
  });

  it('should ...', inject([PnLDataService], (service: PnLDataService) => {
    expect(service).toBeTruthy();
  }));
});
