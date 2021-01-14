import { LogLevel } from '../logging/log-level';
import { OpenIdConfiguration } from './openid-configuration';

export const DEFAULT_CONFIG: OpenIdConfiguration = {
    stsServer: 'https://please_set',
    authWellknownEndpoint: '',
    redirectUrl: 'https://please_set',
    clientId: 'please_set',
    responseType: 'code',
    scope: 'openid email profile',
    hdParam: '',
    postLogoutRedirectUri: 'https://please_set',
    startCheckSession: false,
    silentRenew: false,
    silentRenewUrl: 'https://please_set',
    silentRenewTimeoutInSeconds: 20,
    renewTimeBeforeTokenExpiresInSeconds: 0,
    useRefreshToken: false,
    ignoreNonceAfterRefresh: false,
    postLoginRoute: '/',
    forbiddenRoute: '/forbidden',
    unauthorizedRoute: '/unauthorized',
    autoUserinfo: true,
    autoCleanStateAfterAuthentication: true,
    triggerAuthorizationResultEvent: false,
    logLevel: LogLevel.Warn,
    issValidationOff: false,
    historyCleanupOff: false,
    maxIdTokenIatOffsetAllowedInSeconds: 120,
    disableIatOffsetValidation: false,
    storage: typeof Storage !== 'undefined' ? sessionStorage : null,
    customParams: {},
    eagerLoadAuthWellKnownEndpoints: true,
    disableRefreshIdTokenAuthTimeValidation: false,
};
