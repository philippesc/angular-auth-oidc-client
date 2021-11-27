import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterStateSnapshot, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthStateService } from '../auth-state/auth-state.service';
import { AuthStateServiceMock } from '../auth-state/auth-state.service-mock';
import { CheckAuthService } from '../check-auth.service';
import { CheckAuthServiceMock } from '../check-auth.service-mock';
import { ConfigurationService } from '../config/config.service';
import { ConfigurationServiceMock } from '../config/config.service.mock';
import { LoginService } from '../login/login.service';
import { LoginServiceMock } from '../login/login.service-mock';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { StoragePersistenceServiceMock } from '../storage/storage-persistence.service-mock';
import { AutoLoginPartialRoutesGuard } from './auto-login-partial-routes.guard';
import { AutoLoginService } from './auto-login.service';

describe(`AutoLoginPartialRoutesGuard`, () => {
  let autoLoginPartialRoutesGuard: AutoLoginPartialRoutesGuard;
  let loginService: LoginService;
  let authStateService: AuthStateService;
  let storagePersistenceService: StoragePersistenceService;
  let configurationService: ConfigurationService;
  let autoLoginService: AutoLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AutoLoginService,
        { provide: AuthStateService, useClass: AuthStateServiceMock },
        {
          provide: LoginService,
          useClass: LoginServiceMock,
        },
        {
          provide: StoragePersistenceService,
          useClass: StoragePersistenceServiceMock,
        },
        {
          provide: CheckAuthService,
          useClass: CheckAuthServiceMock,
        },
        {
          provide: ConfigurationService,
          useClass: ConfigurationServiceMock,
        },
      ],
    });
  });

  beforeEach(() => {
    authStateService = TestBed.inject(AuthStateService);
    loginService = TestBed.inject(LoginService);
    storagePersistenceService = TestBed.inject(StoragePersistenceService);
    configurationService = TestBed.inject(ConfigurationService);

    spyOn(configurationService, 'getOpenIDConfiguration').and.returnValue(of({ configId: 'configId1' }));

    autoLoginPartialRoutesGuard = TestBed.inject(AutoLoginPartialRoutesGuard);
    autoLoginService = TestBed.inject(AutoLoginService);
  });

  afterEach(() => {
    storagePersistenceService.clear(null);
  });

  it('should create', () => {
    expect(autoLoginPartialRoutesGuard).toBeTruthy();
  });

  describe('canActivate', () => {
    it(
      'should save current route and call `login` if not authenticated already',
      waitForAsync(() => {
        spyOn(authStateService, 'areAuthStorageTokensValid').and.returnValue(false);
        const checkSavedRedirectRouteAndNavigateSpy = spyOn(autoLoginService, 'checkSavedRedirectRouteAndNavigate');
        const saveRedirectRouteSpy = spyOn(autoLoginService, 'saveRedirectRoute');
        const loginSpy = spyOn(loginService, 'login');

        autoLoginPartialRoutesGuard.canActivate(null, { url: 'some-url1' } as RouterStateSnapshot);

        expect(saveRedirectRouteSpy).toHaveBeenCalledOnceWith({ configId: 'configId1' }, 'some-url1');
        expect(loginSpy).toHaveBeenCalledOnceWith({ configId: 'configId1' });
        expect(checkSavedRedirectRouteAndNavigateSpy).not.toHaveBeenCalled();
      })
    );

    it(
      'should call `checkSavedRedirectRouteAndNavigate` if authenticated already',
      waitForAsync(() => {
        spyOn(authStateService, 'areAuthStorageTokensValid').and.returnValue(true);
        const checkSavedRedirectRouteAndNavigateSpy = spyOn(autoLoginService, 'checkSavedRedirectRouteAndNavigate');
        const saveRedirectRouteSpy = spyOn(autoLoginService, 'saveRedirectRoute');
        const loginSpy = spyOn(loginService, 'login');

        autoLoginPartialRoutesGuard.canActivate(null, { url: 'some-url1' } as RouterStateSnapshot);

        expect(saveRedirectRouteSpy).not.toHaveBeenCalled();
        expect(loginSpy).not.toHaveBeenCalled();
        expect(checkSavedRedirectRouteAndNavigateSpy).toHaveBeenCalledOnceWith({ configId: 'configId1' });
      })
    );
  });

  describe('canActivateChild', () => {
    it(
      'should save current route and call `login` if not authenticated already',
      waitForAsync(() => {
        spyOn(authStateService, 'areAuthStorageTokensValid').and.returnValue(false);
        const checkSavedRedirectRouteAndNavigateSpy = spyOn(autoLoginService, 'checkSavedRedirectRouteAndNavigate');
        const saveRedirectRouteSpy = spyOn(autoLoginService, 'saveRedirectRoute');
        const loginSpy = spyOn(loginService, 'login');

        autoLoginPartialRoutesGuard.canActivateChild(null, { url: 'some-url1' } as RouterStateSnapshot);

        expect(saveRedirectRouteSpy).toHaveBeenCalledOnceWith({ configId: 'configId1' }, 'some-url1');
        expect(loginSpy).toHaveBeenCalledOnceWith({ configId: 'configId1' });
        expect(checkSavedRedirectRouteAndNavigateSpy).not.toHaveBeenCalled();
      })
    );

    it(
      'should call `checkSavedRedirectRouteAndNavigate` if authenticated already',
      waitForAsync(() => {
        spyOn(authStateService, 'areAuthStorageTokensValid').and.returnValue(true);
        const checkSavedRedirectRouteAndNavigateSpy = spyOn(autoLoginService, 'checkSavedRedirectRouteAndNavigate');
        const saveRedirectRouteSpy = spyOn(autoLoginService, 'saveRedirectRoute');
        const loginSpy = spyOn(loginService, 'login');

        autoLoginPartialRoutesGuard.canActivateChild(null, { url: 'some-url1' } as RouterStateSnapshot);

        expect(saveRedirectRouteSpy).not.toHaveBeenCalled();
        expect(loginSpy).not.toHaveBeenCalled();
        expect(checkSavedRedirectRouteAndNavigateSpy).toHaveBeenCalledOnceWith({ configId: 'configId1' });
      })
    );
  });

  describe('canLoad', () => {
    it(
      'should save current route (empty) and call `login` if not authenticated already',
      waitForAsync(() => {
        spyOn(authStateService, 'areAuthStorageTokensValid').and.returnValue(false);
        const checkSavedRedirectRouteAndNavigateSpy = spyOn(autoLoginService, 'checkSavedRedirectRouteAndNavigate');
        const saveRedirectRouteSpy = spyOn(autoLoginService, 'saveRedirectRoute');
        const loginSpy = spyOn(loginService, 'login');

        autoLoginPartialRoutesGuard.canLoad(null, []);

        expect(saveRedirectRouteSpy).toHaveBeenCalledOnceWith({ configId: 'configId1' }, '');
        expect(loginSpy).toHaveBeenCalledOnceWith({ configId: 'configId1' });
        expect(checkSavedRedirectRouteAndNavigateSpy).not.toHaveBeenCalled();
      })
    );

    it(
      'should save current route (with Segments)  and call `login` if not authenticated already',
      waitForAsync(() => {
        spyOn(authStateService, 'areAuthStorageTokensValid').and.returnValue(false);
        const checkSavedRedirectRouteAndNavigateSpy = spyOn(autoLoginService, 'checkSavedRedirectRouteAndNavigate');
        const saveRedirectRouteSpy = spyOn(autoLoginService, 'saveRedirectRoute');
        const loginSpy = spyOn(loginService, 'login');

        autoLoginPartialRoutesGuard.canLoad(null, [
          new UrlSegment('some-url12', {}),
          new UrlSegment('with', {}),
          new UrlSegment('some-param', {}),
        ]);

        expect(saveRedirectRouteSpy).toHaveBeenCalledOnceWith({ configId: 'configId1' }, 'some-url12/with/some-param');
        expect(loginSpy).toHaveBeenCalledOnceWith({ configId: 'configId1' });
        expect(checkSavedRedirectRouteAndNavigateSpy).not.toHaveBeenCalled();
      })
    );

    it(
      'should call `checkSavedRedirectRouteAndNavigate` if authenticated already',
      waitForAsync(() => {
        spyOn(authStateService, 'areAuthStorageTokensValid').and.returnValue(true);
        const checkSavedRedirectRouteAndNavigateSpy = spyOn(autoLoginService, 'checkSavedRedirectRouteAndNavigate');
        const saveRedirectRouteSpy = spyOn(autoLoginService, 'saveRedirectRoute');
        const loginSpy = spyOn(loginService, 'login');

        autoLoginPartialRoutesGuard.canLoad(null, []);

        expect(saveRedirectRouteSpy).not.toHaveBeenCalled();
        expect(loginSpy).not.toHaveBeenCalled();
        expect(checkSavedRedirectRouteAndNavigateSpy).toHaveBeenCalledOnceWith({ configId: 'configId1' });
      })
    );
  });
});
