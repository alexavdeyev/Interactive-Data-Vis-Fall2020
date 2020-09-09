d3.csv("data/hspq.csv").then(function(data) {
      var FactorA = Math.round(d3.mean(data.map(function(d){return d.A})));
      var FactorB = Math.round(d3.mean(data.map(function(d){return d.B})));
      var FactorC = Math.round(d3.mean(data.map(function(d){return d.C})));
      var FactorD = Math.round(d3.mean(data.map(function(d){return d.D})));
      var FactorE = Math.round(d3.mean(data.map(function(d){return d.E})));
      var FactorF = Math.round(d3.mean(data.map(function(d){return d.F})));
      var FactorG = Math.round(d3.mean(data.map(function(d){return d.G})));
      var FactorH = Math.round(d3.mean(data.map(function(d){return d.H})));
      var FactorI = Math.round(d3.mean(data.map(function(d){return d.I})));
      var FactorJ = Math.round(d3.mean(data.map(function(d){return d.J})));
      var FactorO = Math.round(d3.mean(data.map(function(d){return d.O})));
      var FactorQ2 = Math.round(d3.mean(data.map(function(d){return d.Q2})));
      var FactorQ3 = Math.round(d3.mean(data.map(function(d){return d.Q3})));
      var FactorQ4 = Math.round(d3.mean(data.map(function(d){return d.Q4})));
      var AveHSPQ = [];
      AveHSPQ.push(FactorA,FactorB,FactorC,FactorD,FactorE,FactorF,FactorG,FactorH,FactorI,
                   FactorJ,FactorO,FactorQ2,FactorQ3,FactorQ4);

      console.log(data);
      console.log(FactorA); console.log(FactorB); console.log(FactorC); console.log(FactorD);
      console.log(FactorE); console.log(FactorF); console.log(FactorG); console.log(FactorH);
      console.log(FactorI); console.log(FactorJ); console.log(FactorO); console.log(FactorQ2);
      console.log(FactorQ3);console.log(FactorQ4);
      console.log(AveHSPQ);


      const table = d3.select("#d3-table");
      const thead = table.append("thead");

      thead
            .append("tr")
            .append("th")
            .attr("colspan","16")
            .text("STEN SCORES ON THE 14 HSPQ PERSONALITY FACTORS");
      thead
            .append("tr")
            .selectAll("th")
            .data(data.columns)
            .join("th")
            .text(d => d);
      
      const rows = table.append("tbody").selectAll("tr").data(data).join("tr");
      
      rows
            .selectAll("td")
            .data(d => Object.values(d))
            .join("td")  
      // update the below logic to apply to your dataset
      // highlight if age is 15
            .attr("class", d => +d == 15 ? 'highlight' : null)
            .text(d => d);
     

      var svgWidth = 500, svgHeight = 300, barPadding = 5;
      var barWidth = (svgWidth / AveHSPQ.length);
              
      var svg = d3.select('svg')
                  .attr("width", svgWidth)
                  .attr("height", svgHeight);
                  
      var barChart = svg.selectAll("rect")
                  //zoom data
                  .data(AveHSPQ.map(function(d){return d*25;}))
                  .enter()
                  .append("rect")
                  .attr("y", function(d){return svgHeight - d})
                  .attr("height", function(d){return d;})
                  .attr("width", barWidth - barPadding)
                  .attr("transform", function(d,i) {
                      var translate = [barWidth * i, 0]; 
                      return "translate("+ translate +")";
                  }); 
});