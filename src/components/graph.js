import * as React from "react";
import "../components/layout.css"

class GraphFunc extends React.Component {
    constructor(props) {
        super(props);
        console.log("CALLED HERE")
    }

    plot() {
        const func = this.props.func;
        const yStretch = (this.props.height / 2) / this.props.yFin
        return Array(50).fill(1).map((_, i) => {
            const x = this.props.xStart + this.props.dx * i;
            return `${this.props.xStart + this.props.pixelStep * i} ${this.props.y0 - yStretch * func(x)}`
        }).join(" ")
    }

    plotRiemann(drawIndividual=false) {
        const func = this.props.func;
        return Array(this.props.n + 2).fill(1).map((_, i) => {
            const x = this.props.xStart + this.props.dx * i;
            const y = (func(x) - func(x - this.props.dx)) / this.props.yFin;
            if (drawIndividual) return `L ${this.props.xStart + this.props.pixelStep * i} ${this.props.y0} L ${this.props.xStart + this.props.pixelStep * i} ${this.props.y0 - this.props.yStretch * func(x)} L ${this.props.xStart + this.props.pixelStep * (i + 1)} ${this.props.y0 - this.props.yStretch * func(x)}`
            return `L ${this.props.xStart + this.props.pixelStep * i} ${this.props.y0} M ${this.props.xStart + this.props.pixelStep * i} ${this.props.y0} L ${this.props.xStart + this.props.pixelStep * i} ${this.props.y0 - this.props.yStretch * func(x)} L ${this.props.xStart + this.props.pixelStep * (i + 1)} ${this.props.y0 - this.props.yStretch * func(x)}`
        }).join(" ")
    }

    plotTrapezoidal() {
        const func = this.props.func;
        return Array(this.props.n + 1).fill(1).map((_, i) => {
            const x = this.props.xStart + this.props.dx * i;
            return `L ${this.props.xStart + this.props.pixelStep * i} ${this.props.y0 - this.props.yStretch * func(x)} L ${this.props.xStart + this.props.pixelStep * i} ${this.props.y0} L ${this.props.xStart + this.props.pixelStep * i} ${this.props.y0 - this.props.yStretch * func(x)}`
        }).join(" ")
    }

    render() {
        console.log("PATH", this.plot())
        return <>
        <path d={`M 0 ${this.props.y0 - this.props.yStretch * this.props.func(this.props.xStart)} L ${this.plot()}`} fill="transparent" stroke="#0055CC" strokeWidth={"3px"} pathLength={this.props.width} style={{
            strokeDasharray: this.props.width, //`${this.state.width} ${this.state.width}`,
            strokeDashoffset: this.props.width,
            // strokeDashoffset: 1, //this.state.width,
            animation: "dash 3s linear forwards"
        }}/>
        {this.props.showRiemann ? <path opacity={.5} d={`M 0 ${this.props.y0 - this.props.func(this.props.xStart)} ${this.plotRiemann()}`} fill="transparent" stroke="grey" strokeWidth={"3px"} pathLength={this.props.width} style={{
            strokeDasharray: this.props.width,
            strokeDashoffset: this.props.width,
            animation: `dash ${this.props.n * 3}s linear forwards, colorchange1 1s 3s linear forwards`
        }}/> : <></>}
        {this.props.showTrapezoidal ? <path opacity={.5} d={`M 0 ${this.props.y0 - this.props.func(this.props.xStart)} ${this.plotTrapezoidal()} M 0 ${this.props.y0 - this.props.func(this.props.xStart)}`} fill="transparent" stroke="#B2D948" strokeWidth={"3px"} pathLength={this.props.width} style={{
            strokeDasharray: this.props.width,
            strokeDashoffset: this.props.width,
            animation: `dash 3s linear forwards, colorchange2 1s 3s linear forwards`
        }}/> : <></>}
        </>
        
    }
}

class Graph extends React.Component {
    constructor(props) {
        super(props);
        console.log("GOT PROPS", props)
        const width = this.props.width ? this.props.width : window.innerWidth;
        const height = this.props.height ? this.props.height : window.innerHeight;
        const xStart = (this.props.xStart || this.props.xStart == 0) ? this.props.xStart : -20;
        const xFin = (this.props.xFin || this.props.xFin == 0) ? this.props.xFin : 20;
        const yStart = (this.props.yStart || this.props.yStart == 0) ? this.props.yStart : -100;
        const yFin = (this.props.yFin || this.props.yFin == 0) ? this.props.yFin : 10;

        this.changeN = this.changeN.bind(this);
        this.changeDim = this.changeDim.bind(this);

        this.state = {
            width: width,
            height: height,
            x0: width / 2,
            y0: height / 2,
            xStart: xStart,
            yStart: yStart,
            xFin: xFin,
            yFin: yFin,    
            
            funcs: this.props.funcs
        }
    }

    addFunc(func, n = 50, showRiemann=false, showTrapezoidal=false) {
        const toAdd = {
            n: n,
            showRiemann: showRiemann,
            showTrapezoidal: showTrapezoidal,
            func: func
        };
        const funcs = this.state.funcs.concat(toAdd);
        this.setState({ funcs: funcs })
    }

    showTrapezoidal(i) {
        this.setState(({funcs}) => ({
            funcs: [
                ...funcs.slice(0,i),
                {
                    ...funcs[i],
                    showTrapezoidal: !funcs[i].showTrapezoidal,
                },
                ...funcs.slice(i + 1)
            ]
        }));
    }

    showRiemann(i) {
        this.setState(({funcs}) => ({
            funcs: [
                ...funcs.slice(0,i),
                {
                    ...funcs[i],
                    showRiemann: !funcs[i].showRiemann,
                },
                ...funcs.slice(i + 1)
            ]
        }))
    }

    changeN(event) {
        console.log("EVENT RECEIVED", event.target.getAttribute('forFunc'), event.target.value)
        const i = parseInt(event.target.getAttribute('forFunc'));
        const n = parseInt(event.target.value);
        
        this.setState(({funcs}) => ({
            funcs: [
                ...funcs.slice(0,i),
                {
                    ...funcs[i],
                    n: n
                },
                ...funcs.slice(i + 1)
            ]
        }));
    }

    changeDim(event) {
        console.log("EVENT RECEIVED", event.target.getAttribute('stateParam'), event.target.value)
        const stateParam = event.target.getAttribute('stateParam')
        const newVal = parseFloat(event.target.value);
        const xFin = (stateParam == "xFin") ? parseFloat(newVal) : this.state.xFin;
        const xStart = (stateParam == "xFin") ? parseFloat(newVal) : this.state.xFin;
        const dx = (xFin - xStart) / this.state.n;
        this.setState({
            [stateParam]: newVal,
            dx: dx
        });
    }

    render() {
        console.log("FUNCS", this.state.funcs)
        const buttons = this.state.funcs.map((x, i) => {
            return <><a className="btn" onClick={() => this.showRiemann(i)}>{x.showRiemann ? "Remove" : "Add"} Riemann {x.showRiemann ? "from" : "to"} Function {i}</a>
            <a className="btn" onClick={() => this.showTrapezoidal(i)}>{x.showTrapezoidal ? "Remove" : "Add"} Trapezoidal {x.showTrapezoidal ? "from" : "to"} Function {i}</a>
            <p class="range-field">
                <h3>Set n:</h3>
                    <input type="range" forFunc={i} min="0" max="20" onChange={this.changeN} />
            </p>
            <br/><br/></>
        })
        return <div style={{
            height: this.state.height,
            width: this.state.width
        }} className="center-align">
            <svg width={this.state.width} height={"100%"}>
                {/* <rect width="100%" height="100%" fill="black"></rect> */}
                {this.state.funcs.map(x => {
                    console.log("X", x);
                    console.log("DIMS", this.state.xStart, this.state.xFin, this.state.yFin, this.state.dx)
                    const dx = (this.state.xFin - this.state.xStart) / x.n;
                    const pixelStep = this.state.width / x.n;
                    const yStretch = (this.state.height / 2) / this.state.yFin;
                    return <GraphFunc 
                        width={this.state.width} height={this.state.height} xStart={this.state.xStart} yStart={this.state.yStart} xFin={this.state.xFin} yFin={this.state.yFin} x0={this.state.x0} y0={this.state.y0}
                        yStretch={yStretch} n={x.n} showRiemann={x.showRiemann} showTrapezoidal={x.showTrapezoidal} func={x.func} dx={dx} pixelStep={pixelStep} />
                }
                )}
                <line x1={0} y1={this.state.y0} x2={this.state.width} y2={this.state.y0} stroke="#2A707A" />
            </svg>
            <div class="row">
                <div className="input-field col s4">
                <input stateParam="xStart" type="number" onChange={this.changeDim} defaultValue={this.state.xStart} />
                    <p>x Min</p>
                </div>
                <div className="input-field col s4">
                <input stateParam="xFin" type="number" onChange={this.changeDim}  defaultValue={this.state.xFin} />
                    <p>x Max</p>
                </div>
                <div className="input-field col s4">
                    <input stateParam="yFin" type="number" onChange={this.changeDim}  defaultValue={this.state.yFin} />
                    <p>y Max</p>
                </div>
            </div>
            {buttons}
        </div>
    }
}

export {Graph, GraphFunc}