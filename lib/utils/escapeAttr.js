function escapeAttr(str) {
    return (str + '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;');
}

export default escapeAttr;
