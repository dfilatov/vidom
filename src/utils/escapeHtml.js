export default function escapeHtml(str) {
    str = str + '';

    if(~str.indexOf('&')) {
        str = str.replace(/&/g, '&amp;');
    }

    if(~str.indexOf('<')) {
        str = str.replace(/</g, '&lt;');
    }

    if(~str.indexOf('>')) {
        str = str.replace(/>/g, '&gt;');
    }

    return str;
}
