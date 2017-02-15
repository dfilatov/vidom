class Hello extends vidom.Component {
    onInit() {
        this.setState({ counter : 1 });
    }

    onRender() {
        return (
            <div>
	            <h1>Hello, { this.attrs.name }!</h1>
	            <div>I see you { this.state.counter } time</div>
            </div>
        );
    }

    onMount() {
        setInterval(() => {
            this.setState({ counter : this.state.counter + 1 });
        }, 1000);
    }
}

vidom.mount(document.body, <Hello name="World"/>);
