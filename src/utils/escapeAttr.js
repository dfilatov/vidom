const AMP_RE = /&/g,
    QUOT_RE = /"/g;

export default function escapeAttr(str) {
    str = str + '';

    let i = str.length,
        escapes = 0; // 1 — escape '&', 2 — escape '"'

    while(i-- > 0) {
        switch(str.charCodeAt(i)) {
            case 38:
                escapes |= 1;
                break;

            case 34:
                escapes |= 2;
                break;
        }
    }

    if((escapes & 1) === 1) {
        str = str.replace(AMP_RE, '&amp;');
    }

    if((escapes & 2) === 2) {
        str = str.replace(QUOT_RE, '&quot;');
    }

    return str;
}
