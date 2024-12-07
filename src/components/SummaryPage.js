import React, { useEffect } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import "./Summary.css"; 

const SummaryPage = () => {
  const navigate = useNavigate();


  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);

 
  useEffect(() => {
    fetch("http://localhost:3000/api/chart-data")
      .then((response) => response.json())
      .then((data) => renderChart(data.summary));
  }, []);

  const renderChart = (data) => {
    const width = 800,
      height = 400, // Reduced height
      radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    
    d3.select("#chart").select("svg").remove();

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg
      .selectAll("g")
      .data(pie(data))
      .enter()
      .append("g");

  
    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.initiative));

    
    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("font-size", "10px") // Reduced font size
      .style("fill", "#000")
      .text((d) => d.data.initiative)
      .call(wrapText, radius); 
  };

  
  const wrapText = (text, width) => {
    text.each(function () {
      const textElement = d3.select(this);
      const words = textElement.text().split(/\s+/).reverse();
      let word;
      let line = [];
      const lineHeight = 1.1; // Line height in ems
      const x = textElement.attr("x") || 0;
      const y = textElement.attr("y") || 0;
      let dy = parseFloat(textElement.attr("dy")) || 0;
      let tspan = textElement
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", `${dy}em`);

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = textElement
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", `${lineHeight}em`)
            .text(word);
        }
      }

      
      const bbox = textElement.node().getBBox();
      if (bbox.x + bbox.width > width / 2) {
        textElement.attr("transform", `translate(${bbox.x - 10}, ${bbox.y})`);
      } else if (bbox.x < -width / 2) {
        textElement.attr("transform", `translate(${bbox.x + 10}, ${bbox.y})`);
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div>
      <header>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/summary" aria-current="page">
            Summary
          </a>
          <a href="/reports">Reports</a>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <main>
        <h1>Summary of Key Initiatives</h1>
        <div id="chart"></div>
        <p>
          The chart above illustrates the distribution of focus areas for key
          initiatives undertaken during Charlotte’s IEP extension application.
          Data shows a significant focus on research expansion (40%), energy
          innovations (25%), and partnerships to enhance the region’s tech
          capabilities. Source: UNC Charlotte IEP Application.
        </p>
      </main>
    </div>
  );
};

export default SummaryPage;
