import React, { useRef, useEffect} from 'react';
import * as d3 from "d3";
import {scaleLinear} from 'd3-scale';


export default function CollegeChart(props){
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", props.size[0])
            .attr("height", props.size[1])
    }, []);

    useEffect(() => {
        draw();
    }, [props.data]);

    const draw = () => {

        const svg = d3.select(ref.current);
        const size = props.size;
        const margin = 125;
        const marginTop = 50;
        svg.attr("width", size[0] + 2*margin)
            .attr("height", size[1] + 2*margin)
        
        // console.log(studentsByMajor);
        const dataMax = Math.max.apply(Math, props.data.map(function(o) { return o.TotalStudents; }))
        
        let selection = svg.append("g")
            .attr("transform", "translate("+margin+","+marginTop+")")
            .selectAll("rect").data(props.data);
        const yScale = scaleLinear()
            .domain([0, dataMax])
            .range([size[1], 0])
        const xScale = d3.scaleBand()
            .domain(d=>d.key)
            .range([0,size[0]])
        xScale.domain(props.data.map((d) => { return d.MajorName; }));
        var colorScale = scaleLinear()
            .domain([0, props.data.length])
            .range(["#13294b","#E84A27"])
            .interpolate(d3.interpolateHcl);
        const barWidth = size[0]/props.data.length;

        selection
            .enter()
            .append("rect")
            .style("fill", (d, i) => {
                return colorScale(i);
            })
            .style('cursor', 'pointer') 
            .attr('x', (d, i) => i * barWidth)
            .attr('y', (d) => yScale(parseInt(d.TotalStudents, 10)))
            .attr('height', d => size[1] - yScale(parseInt(d.TotalStudents, 10)))
            .attr('width', barWidth )
            .on("mouseover", (d, i) => {
                // console.log(d3.event);
                props.handleTool(d, i * barWidth, yScale(parseInt(d.TotalStudents, 10)));
            })
            .on('mouseout', () => {
                props.handleToolOff();
            })
            .on('click', (d, i) => {
                props.handleToolOff();
                props.handleClickCollege(i);
            })
            .exit()
            .remove()
        
        svg
            .append("g")
            .attr("transform", "translate("+margin+","+marginTop+")")
            .call(d3.axisLeft(yScale))
        
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 + margin/4)
            .attr("x",0 - (size[1] / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Students")
            .style("font-size", "1.5em");   

        svg.append("text")
            .attr("transform",
            "translate(" + (size[0]/2 + margin)+","+(marginTop-30)+")")
            .style("text-anchor", "middle")
            .text("College")
            .style("font-size", "1.5em")
            .style("color", "#1F4096")

        svg
            .append("g")
            .attr("transform", "translate("+margin+", "+(size[1]+marginTop)+")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
    }

    return(
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>
    )
}