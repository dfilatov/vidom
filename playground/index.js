import './index.css';
import { Component, mount } from 'vidom';
import codemirror from 'codemirror';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/night.css';
import vidomJsx from 'babel-plugin-vidom-jsx';
import code from '!raw-loader!./code.js';

const ERROR_TIMEOUT = 300;

Babel.registerPlugin('vidom-jsx', vidomJsx);

class Playground extends Component {
    onInit() {
        this._editor = null;
        this._output = null;
        this._version = null;
        this._errorTimer = null;

        this._onPlayGroundInRef = this._onPlayGroundInRef.bind(this);
        this._onPlayGroundOutRef = this._onPlayGroundOutRef.bind(this);
        this._onCodeChange = this._onCodeChange.bind(this);
        this._onCodeError = this._onCodeError.bind(this);

        const localStorageCode = localStorage.getItem('playgroundCode');

        this.setState({
            code : localStorageCode === null?
                code :
                localStorageCode,
            error : null
        });
    }

    onRender() {
        const { error } = this.state;

        return (
            <fragment>
                <div
                    class={ 'Playground__in' + (error? ' Playground__in_hasError' : '') }
                    ref={ this._onPlayGroundInRef }
                />
                <iframe class="Playground__out" frameBorder="0" ref={ this._onPlayGroundOutRef }/>
                { error &&
                    <pre class="Playground__error">
                        { error.toString() }
                    </pre>
                }
            </fragment>
        );
    }

    onMount() {
        this._executeCode();
    }

    onUpdate(prevAttrs, prevChildren, prevState) {
        if(this.state.code !== prevState.code) {
            this._executeCode();
        }
    }

    _onPlayGroundInRef(ref) {
        this._editor = codemirror(
            ref,
            {
                theme : 'night',
                lineNumbers : true,
                mode : 'jsx',
                value : this.state.code
            });

        this._editor.setSize('100%', '100%');
        this._editor.on('changes', this._onCodeChange);
    }

    _onPlayGroundOutRef(ref) {
        this._output = ref;
    }

    _onCodeChange() {
        const code = this._editor.getValue();

        this.setState({ code });

        localStorage.setItem('playgroundCode', code);
    }

    _executeCode() {
        const version = this._version = Math.random(),
            output = this._output;

        output.src = 'out.html?' + version;
        output.onload = () => {
            if(version === this._version) {
                try {
                    output.contentWindow.onerror = this._onCodeError;
                    output.contentWindow.eval(transformCode(this.state.code));

                    if(this._errorTimer !== null) {
                        clearTimeout(this._errorTimer);
                        this._errorTimer = null;
                    }

                    if(this.state.error) {
                        this.setState({ error : null });
                    }
                }
                catch(error) {
                    this._onCodeError(error);
                }
            }
        };
    }

    _onCodeError(error) {
        if(this._errorTimer !== null) {
            clearTimeout(this._errorTimer);
        }

        this._errorTimer = setTimeout(() => {
            this._errorTimer = null;
            this.setState({ error });
        }, ERROR_TIMEOUT);
    }
}

function transformCode(code) {
    return Babel.transform(
        code,
        {
            presets : ['es2015-loose'],
            plugins : [['vidom-jsx', { autoRequire : false }]]
        }).code;
}

mount(document.body, <Playground/>);

