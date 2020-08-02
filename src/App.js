import React, {Component, useEffect} from 'react';
import './App.css';
import * as d3 from "d3";
import Barchart from "./Components/Barchart";
import Tooltip from "./Components/Tooltip";
import data from './majordata.csv';
import { getDefaultNormalizer } from '@testing-library/react';
import CollegeChart from './Components/CollegeChart';
import StudentClass from './Components/StudentClass'

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            hoveredBar: null,
            x: 0,
            y: 0,
            dataByCollege: [],
            collegeTotals: [],
            page: 0,
            home: true,
            major: null
        }
        this.getData = this.getData.bind(this);
        this.handleTool = this.handleTool.bind(this);
        this.handleToolOff = this.handleToolOff.bind(this);
        this.handleClickCollege = this.handleClickCollege.bind(this);
        this.handleClickMajor = this.handleClickMajor.bind(this);
    }

    componentDidMount() {
        this.getData()
    };

    getData(){
        d3.csv(data).then(data => {
            // console.log(data)
            // console.log(data.length)
            var index;
            let begin = 0;
            let nextState1 = [];
            let nextState2 = [];
            for(index = 0; index < data.length; index++ ) {
                if(data[index].Concentration === "***College total***" ){
                    nextState1.push(data.slice(begin, index))
                    nextState2.push(data[index])
                    index++;
                    begin = index;
                }
                // console.log(data[index].Cocentration)
            }
            this.setState({dataByCollege: nextState1, collegeTotals: nextState2})
            // console.log(nextState1)
            // console.log(nextState2)
            return data;
        }).catch(function(err) {
            throw err;
        })
    }

    handleTool(datum, x, y){
        this.setState({hoveredBar: datum, x: x, y: y})
    }

    handleToolOff(){
        this.setState({hoveredBar: null})
    }

    handleClickCollege(index){
        this.setState({home: false, page: index})
    }

    handleClickMajor(datum){
        // console.log(datum);
        this.setState({major: datum})
    }

    render() {
        // console.log(this.state.data);
        if(this.state.dataByCollege.length === 0)
            return null;
        let page = this.state.page;
        let home = this.state.home;
        let major = this.state.major;
        let title = major ? major.key : this.state.collegeTotals[page].MajorName;
        return (
            <div className="App">
                <h2>{home ? `University of Illinois Urbana-Champaign Colleges`
                    : title}</h2>
                {!home ? <button onClick={() => this.setState({home: true, major: null}) } >Back Home</button> : null }
                <div className="Figure">
                    
                    {!home && !major ?
                        <Barchart data={this.state.dataByCollege[page]} size={[1000, 500]} handleTool={this.handleTool} 
                        handleToolOff={this.handleToolOff} handleClickMajor={this.handleClickMajor} />
                        : null
                    }
                    {home ?
                        <CollegeChart data={this.state.collegeTotals} size={[1000, 500]} 
                        handleTool={this.handleTool} handleToolOff={this.handleToolOff} handleClickCollege={this.handleClickCollege} />
                        : null
                    }
                    {major ? 
                        <StudentClass data={this.state.major} size={[1000, 500]} 
                        handleTool={this.handleTool} handleToolOff={this.handleToolOff}/> : null
                    }
                    
                    { this.state.hoveredBar ?
                        <Tooltip
                            hoveredBar={this.state.hoveredBar}
                            x={this.state.x}
                            y={this.state.y}
                        /> :
                        null
                    }
                </div>
            </div>
        )
    }
}

export default App;
