const AMP_RE = /&/g,
    LT_RE = /</g,
    GT_RE = />/g;

export default function escapeHtml(str) {
    str = str + '';

    const len = str.length;
    let i = 0,
        escapeAmp = false,
        escapeLt = false,
        escapeGt = false;

    while(i < len) {
        switch(str[i++]) {
            case '&':
                escapeAmp = true;
                break;

            case '<':
                escapeLt = true;
                break;

            case '>':
                escapeGt = true;
                break;
        }
    }

    if(escapeAmp) {
        str = str.replace(AMP_RE, '&amp;');
    }

    if(escapeLt) {
        str = str.replace(LT_RE, '&lt;');
    }

    if(escapeGt) {
        str = str.replace(GT_RE, '&gt;');
    }

    return str;
}
