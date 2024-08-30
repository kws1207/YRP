import Plot from "react-plotly.js";
import * as d3 from "d3";
import { DataPoint } from "../types";

const width = 1400;

export default function Chart({ data }: { data: DataPoint[] }) {
  const xSumZ = d3.rollup(
    data,
    (v) => d3.sum(v, (d) => d.Z),
    (d) => d.X
  );

  const minDate =
    d3
      .min(data, (d: DataPoint) => d3.timeParse("%Y-%m-%d")(d.X))
      ?.toISOString() || new Date().toISOString();
  const maxDate =
    d3
      .max(data, (d: DataPoint) => d3.timeParse("%Y-%m-%d")(d.X))
      ?.toISOString() || new Date().toISOString();
  const futureDate = d3.timeDay.offset(new Date(maxDate), 180).toISOString();

  const pastDateRange = data
    .filter((d) => d.Type === "Past" && d.Z === 10)
    .map((d) => d.X);
  const pastLineY = data
    .filter((d) => d.Type === "Past" && d.Z === 10)
    .map((d) => d.Y);

  return (
    <div className="flex flex-col">
      <Plot
        onClick={(data) => {
          let pts = "";
          for (let i = 0; i < data.points.length; i++) {
            pts =
              "x = " + data.points[i].x + "\ny = " + data.points[i].y + "\n\n";
          }
          alert("Closest point clicked:\n\n" + pts);
        }}
        config={{
          scrollZoom: false,
          doubleClick: false,
          responsive: false,
          displayModeBar: false,
          showAxisRangeEntryBoxes: false,
          showAxisDragHandles: false,
          modeBarButtons: false,
          editable: false,
        }}
        data={[
          {
            x: data.map((d) => d.X),
            y: data.map((d) => d.Y),
            mode: "markers",
            marker: {
              symbol: "circle",
              size: 25,
              color: data.map((d) => d.Z),
              colorscale: "Viridis",
              colorbar: {
                title: "Intensity",
                tickvals: d3.range(0, 10),
              },
              cmin: 0,
              cmax: 10,
            },
            type: "scatter",
            name: "Data Points",
          },
          {
            x: pastDateRange,
            y: pastLineY,
            mode: "lines+markers",
            line: { color: "red", width: 2 },
            marker: { size: 8, color: "red" },
            name: "Past Data",
            showlegend: false,
          },
        ]}
        layout={{
          paper_bgcolor: "rgba(0,0,0,0)",
          title: "Past Data and Future Prediction",
          height: 600,
          width: width + 40,
          showlegend: false,
          xaxis: {
            type: "date",
            range: [minDate, futureDate],
            showgrid: false,
            fixedrange: true,
          },
          yaxis: {
            title: "Value",
            range: [0.5, 10.5],
            dtick: 1,
            showgrid: false,
            fixedrange: true,
          },
          shapes: [
            {
              type: "line",
              x0: "2024-01-01",
              y0: 0,
              x1: "2024-01-01",
              y1: 1,
              xref: "x",
              yref: "paper",
              line: {
                color: "black",
                width: 2,
                dash: "dash",
              },
            },
          ],
          annotations: [
            {
              x: minDate,
              y: 10.5,
              text: "Past",
              showarrow: false,
              yanchor: "bottom",
              xref: "x",
              yref: "y",
            },
            {
              x: futureDate,
              y: 10.5,
              text: "Future (Predicted)",
              showarrow: false,
              yanchor: "bottom",
              xref: "x",
              yref: "y",
            },
            {
              x: "2023-01-01",
              y: 10.5,
              text: "Past",
              showarrow: false,
              yanchor: "bottom",
              xref: "x",
              yref: "y",
            },
            {
              x: "2024-07-01",
              y: 10.5,
              text: "Future (Predicted)",
              showarrow: false,
              yanchor: "bottom",
              xref: "x",
              yref: "y",
            },
          ],
          plot_bgcolor: "rgba(0,0,0,0)",
        }}
      />
      <Plot
        config={{
          scrollZoom: false,
          doubleClick: false,
          responsive: false,
          displayModeBar: false,
          showAxisRangeEntryBoxes: false,
          showAxisDragHandles: false,
          modeBarButtons: false,
          editable: false,
        }}
        data={[
          {
            x: Array.from(xSumZ.keys()),
            y: Array.from(xSumZ.values()),
            marker: { color: "lightskyblue" },
            type: "bar",
            name: "Sum(Z) by Date",
          },
        ]}
        layout={{
          paper_bgcolor: "rgba(0,0,0,0)",
          height: 400,
          width: width,
          showlegend: false,
          xaxis: {
            title: "Date",
            type: "date",
            range: [minDate, futureDate],
          },
          yaxis: {
            title: "Sum(Z)",
          },
          shapes: [
            {
              type: "line",
              x0: "2024-01-01",
              y0: 0,
              x1: "2024-01-01",
              y1: 1,
              xref: "x",
              yref: "paper",
              line: {
                color: "black",
                width: 2,
                dash: "dash",
              },
            },
          ],
          plot_bgcolor: "rgba(0,0,0,0)",
        }}
      />
    </div>
  );
}
