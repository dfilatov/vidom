var mounter = require('./client/mounter');

module.exports = {
    createComponent : require('./createComponent'),
    createNode : require('./createNode'),
    mountToDom : mounter.mountToDom,
    mountToDomSync : mounter.mountToDomSync,
    unmountFromDom : mounter.unmountFromDom,
    unmountFromDomSync : mounter.unmountFromDomSync,
    renderToString : require('./renderToString')
};
