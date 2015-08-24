const ua = global.navigator? global.navigator.userAgent : '';

export const isTrident = ua.indexOf('Trident') > -1;
