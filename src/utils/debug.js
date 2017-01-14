if(typeof process === 'undefined') {
    process = { env : { NODE_ENV : 'development' } };
}

/** @const */
export const IS_DEBUG = process.env.NODE_ENV === 'development';
