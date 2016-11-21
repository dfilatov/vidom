export default function escapeAttr(str) {
    str = str + '';

    if(~str.indexOf('&')) {
        str = str.replace(/&/g, '&amp;');
    }

    if(~str.indexOf('"')) {
        str = str.replace(/"/g, '&quot;');
    }

    return str;
}
