const AMP_RE = /&/g,
    LT_RE = /</g,
    GT_RE = />/g;

export default function escapeHtml(str) {
    str = str + '';

    let i = str.length,
        escapes = 0; // 1 — escape '&', 2 — escape '<', 4 — escape '>'

    while(i-- > 0) {
        switch(str.charCodeAt(i)) {
            case 38:
                escapes |= 1;
                break;

            case 60:
                escapes |= 2;
                break;

            case 62:
                escapes |= 4;
                break;
        }
    }

    if((escapes & 1) === 1) {
        str = str.replace(AMP_RE, '&amp;');
    }

    if((escapes & 2) === 2) {
        str = str.replace(LT_RE, '&lt;');
    }

    if((escapes & 4) === 4) {
        str = str.replace(GT_RE, '&gt;');
    }

    return str;
}
