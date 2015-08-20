import { node, mountToDom } from '../src/vidom';

const root1DomNode = document.getElementById('root1');

mountToDom(
    root1DomNode,
    node('div').children('!!!!!!'));
