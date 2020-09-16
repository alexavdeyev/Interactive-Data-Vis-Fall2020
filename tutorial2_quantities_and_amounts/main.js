d3.csv("data/gold.csv", d3.autoType).then(data => {
    
    console.log(data);
    
    const svg = d3.select("#my-svg"),
          svgWidth = 500, svgHeight = 500,
          margin = {top: 0, right: 50, bottom: 30, left: 100};
        

    
    
    
    
    
    
    
    
    
    var InnerWidth = svgWidth - margin.left - margin.right,
        InnerHeight = svgHeight - margin.top - margin.bottom,
    
        xScale = d3.scaleLinear()
            .domain([0, d3.max(data.map(d => d.tonnes))])
            .range([0, InnerWidth]),
            
        yScale = d3.scaleBand()
            .domain(data.map(d => d.country))
            .range([0, InnerHeight])
            .padding(.15),
        
        xAxis = svg.append("g")
            .attr("class","axis x")
            .style("color","white")
            .attr('transform', `translate(${margin.left}, ${InnerHeight})`)
            .call(d3.axisBottom(xScale)),
        
        yAxis = svg.append("g")
            .attr("class","axis y")
            .style("color","white")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(d3.axisLeft(yScale)),
        
        bars = svg.selectAll("rect")
            .data(data)
            .join("rect")
            .style("fill", "#ffba29")
            .attr("rx", 10)
            .attr("y", d => yScale(d.country))
            .attr("width", d => xScale(d.tonnes))
            .attr("height", d => yScale.bandwidth())
            .attr("transform",`translate(${margin.left}, ${margin.top})`);      

})
        




 