if(typeof process === 'undefined') {
    process = { env : { NODE_ENV : 'development' } };
}
else if(typeof process.env.NODE_ENV === 'undefined') {
    process.env['NODE_ENV'] = 'development'; // wrap NODE_ENV to prevent being replaced by rollup
}

/** @const */
export const IS_DEBUG = process.env.NODE_ENV === 'development';