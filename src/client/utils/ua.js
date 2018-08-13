const ua = typeof navigator === 'undefined'? '' : navigator.userAgent,
    platform = typeof navigator === 'undefined'? '' : navigator.platform;

export const isTrident = ua.indexOf('Trident') > -1;
export const isEdge = ua.indexOf('Edge') > -1;
export const isIos = /iPad|iPhone|iPod/.test(platform);
