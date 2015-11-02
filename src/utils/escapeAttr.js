export default str =>
    (str + '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;');
