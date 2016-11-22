const AMP_RE = /&/g,
    QUOT_RE = /"/g;

export default function escapeAttr(str) {
    str = str + '';

    const len = str.length;
    let i = 0,
        escapeAmp = false,
        escapeQuot = false;

    while(i < len) {
        switch(str[i++]) {
            case '&':
                escapeAmp = true;
                break;

            case '"':
                escapeQuot = true;
                break;
        }
    }

    if(escapeAmp) {
        str = str.replace(AMP_RE, '&amp;');
    }

    if(escapeQuot) {
        str = str.replace(QUOT_RE, '&quot;');
    }

    return str;
}
