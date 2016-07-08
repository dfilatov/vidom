const ua = typeof navigator === 'undefined'? '' : navigator.userAgent;

export const isTrident = ua.indexOf('Trident') > -1;
export const isEdge = ua.indexOf('Edge') > -1;
