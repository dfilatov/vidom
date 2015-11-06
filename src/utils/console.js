import noOp from './noOp';

const globalConsole = global.console,
    console = {};

['log', 'info', 'warn', 'error'].forEach(function(name) {
    console[name] = globalConsole?
        globalConsole[name]?
            function(arg1, arg2, arg3, arg4, arg5) { // IE9: console methods aren't functions
                switch(arguments.length) {
                    case 1:
                        globalConsole[name](arg1);
                    break;

                    case 2:
                        globalConsole[name](arg1, arg2);
                    break;

                    case 3:
                        globalConsole[name](arg1, arg2, arg3);
                    break;

                    case 4:
                        globalConsole[name](arg1, arg2, arg3, arg4);
                    break;

                    case 5:
                        globalConsole[name](arg1, arg2, arg3, arg4, arg5);
                    break;
                }
            } :
            function() {
                globalConsole.log.apply(globalConsole, arguments);
            } :
        noOp;
});

export default console;
