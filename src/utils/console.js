import noOp from './noOp';

const globalConsole = global.console,
    console = {};

['log', 'info', 'warn', 'error'].forEach(function(name) {
    console[name] = globalConsole?
        globalConsole[name]?
            function() {
                globalConsole[name].apply(globalConsole, arguments);
            } :
            function() {
                globalConsole.log.apply(globalConsole, arguments);
            } :
        noOp;
});

export default console;
