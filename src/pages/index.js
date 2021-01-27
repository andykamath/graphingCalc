import * as React from "react";
import {Graph, GraphFunc} from "./graph";
import "../components/layout.css";

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            funcs: [],
            graphHeight: window.innerHeight / 4,
            graphWidth: window.innerWidth / 4,
            graphXStart: 0,
            graphXFin: 2 * Math.PI,
            graphYStart: -1,
            graphYFin: 1
        }
        this._child = React.createRef();
    }

    componentDidMount() {
        this.addFunc(Math.sin)
    }

    addFunc(func, n = 25, showRiemann=false, showTrapezoidal=false) {
        const dx = (this._child.current.state.xFin - this._child.current.state.xStart) / n;
        const pixelStep = this._child.current.state.width / n;
        const yStretch = (this._child.current.state.height / 2) / this._child.current.state.yFin;
        const toAdd = {
            yStretch: yStretch,
            n: n,
            showRiemann: showRiemann,
            showTrapezoidal: showTrapezoidal,
            func: func,
            dx: dx,
            pixelStep: pixelStep
        };
        const funcs = this._child.current.state.funcs.concat(toAdd);
        this._child.current.setState({ funcs: funcs, xStart: 0 })
    }

    render() {
        console.log("INDEX FUNCS", this.state.funcs)
        const g = <Graph ref={this._child} funcs={this.state.funcs.map(x => x)} height={this.state.graphHeight} width={this.state.graphWidth} xStart={this.state.graphXStart} xFin={this.state.graphXFin} yFin={this.state.graphYFin} />
        return (
            <main style={{
                height: "100vh",
                width: "100%"
            }} className="valign-wrapper center-align">
                <div className="container center-align">
                    <a className="btn" onClick={() => this.addFunc(Math.cos)}>Add Function</a>
                    {g}
                </div>
            </main>
        )
    }
}

export default IndexPage
