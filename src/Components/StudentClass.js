import React, { useRef, useEffect} from 'react';
import {scaleLinear} from 'd3-scale';
import '../Barchart.css';
import * as d3 from "d3";

function StudentClass({data, size, handleTool, handleToolOff}){
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", size[0])
            .attr("height", size[1])
    }, []);

    useEffect(() => {
        draw();
    }, [data]);

    const draw = () => {

            const svg = d3.select(ref.current);
            const margin = 125;
            const marginTop = 50;
            svg.attr("width", size[0] + 2*margin)
                .attr("height", size[1] + 2*margin)
            
            
            // console.log(studentsByMajor);
            const dataMax = data.value.total;
            
            let selection = svg.append("g")
                .attr("transform", "translate("+margin+","+marginTop+")")
                .selectAll("rect").data(Object.entries(data.value));
            const yScale = scaleLinear()
                .domain([0, dataMax])
                .range([size[1], 0])
            const xScale = d3.scaleBand()
                .domain(d=>d.key)
                .range([0,size[0]])
            xScale.domain(Object.keys(data.value).map((d) => { return d; }));
            var colorScale = scaleLinear()
                .domain([0, Object.keys(data.value).length])
                .range(["#0455A4","#E84A27"])
                .interpolate(d3.interpolateHcl);
            const barWidth = size[0]/Object.keys(data.value).length;

            selection
                .enter()
                .append("rect")
                .style("fill", (d, i) => {
                    return colorScale(i);
                }) 
                .attr('x', (d, i) => i * barWidth)
                .attr('y', (d) => yScale(parseInt(d[1], 10)))
                .attr('height', d => size[1] - yScale(parseInt(d[1], 10)))
                .attr('width', barWidth )
                .on("mouseover", (d, i) => {
                    // console.log(d3.event);
                    handleTool(d, i * barWidth, yScale(parseInt(d[1], 10)));
                })
                .on('mouseout', () => {
                    handleToolOff();
                })
                .exit()
                .remove()


            svg
                .append("g")
                .attr("transform", "translate("+margin+","+marginTop+")")
                .call(d3.axisLeft(yScale))
            
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (size[1] / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Students")
                .style("font-size", "1.5em");   

            svg.append("text")
                .attr("transform",
                "translate(" + (size[0]/2 + margin)+","+(marginTop-30)+")")
                .style("text-anchor", "middle")
                .text("Class")
                .style("font-size", "1.5em")

            svg
                .append("g")
                .attr("transform", "translate("+margin+", "+(size[1]+marginTop)+")")
                .call(d3.axisBottom(xScale))
                .selectAll("text")	
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");

            selection
                .exit()
                .remove()

    }

    return(
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>
    )
}

export default StudentClass




