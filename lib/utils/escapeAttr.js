function escapeAttr(str) {
    return (str + '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;');
}

module.exports = escapeAttr;
