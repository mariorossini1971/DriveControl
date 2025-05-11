import { TestBed } from '@angular/core/testing';
import { HttpInterceptor } from '@angular/common/http';
import { AuthInterceptor } from './interceptor.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthInterceptor],
    });

    interceptor = TestBed.inject(AuthInterceptor); // Obtener instancia del interceptor
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});

