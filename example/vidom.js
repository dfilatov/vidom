import { node, mountToDom } from '../lib/vidom';

const root1DomNode = document.getElementById('root1');

mountToDom(
    root1DomNode,
    node('div'));
