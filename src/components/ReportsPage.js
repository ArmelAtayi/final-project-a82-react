import React, { useEffect } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import "./Reports.css"; 

const ReportsPage = () => {
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  // Fetch data and render chart
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/chart-data");
        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }
        const data = await response.json();

       
        d3.select("#chart").selectAll("*").remove();

        
        renderChart(data.reports);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        
        const errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "block";
        errorMessage.textContent = "There was an error loading the chart data. Please try again later.";
      }
    };

    fetchData();
  }, []);

  const renderChart = (data) => {
    const width = 400, 
      height = 400,
      radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

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
      .attr("fill", (d) => color(d.data.category));

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("font-size", "12px") // Smaller font for better fit
      .text((d) => d.data.category) // Initial text to be wrapped
      .call(wrapText, 80); // Adjusted wrap width

    
    svg
      .append("title")
      .text("Pie chart showing the distribution of categories for key initiatives");
  };

  
  const wrapText = (text, width) => {
    text.each(function () {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let word;
      let line = [];
      const lineHeight = 1.1; 
      const y = text.attr("y") || 0;
      const x = text.attr("x") || 0;
      let tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", "0em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", `${lineHeight}em`)
            .text(word);
        }
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/"); 
  };

  return (
    <div className="reports-page">
      <header>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/summary">Summary</a>
          <a href="/reports" aria-current="page">
            Reports
          </a>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <main>
        <h1>Reports on Key Initiatives</h1>

        {/* Accessible error message */}
        <div id="error-message" role="alert" style={{ display: "none", color: "red" }}></div>

        <div id="chart-container" className="chart-container">
          <div id="chart" role="region" aria-live="polite" aria-labelledby="chart-title"></div>
        </div>

        <p>
          The chart above visualizes the distribution of categories for key
          initiatives undertaken during Charlotte’s IEP extension application.
          Data highlights significant focus on research and innovation (50%),
          economic growth (30%), and technology development (20%). Source: UNC
          Charlotte IEP Application.
        </p>
      </main>
    </div>
  );
};

export default ReportsPage;
