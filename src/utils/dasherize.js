const DASHERIZE_RE = /([^A-Z]+)([A-Z])/g;

export default str => str.replace(DASHERIZE_RE, '$1-$2').toLowerCase();
