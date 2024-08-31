import Plot from "react-plotly.js";
import * as d3 from "d3";
import { DataPoint, XrpPrices } from "../types";

const width = 800;

export default function Chart({
  data,
  xrpPrices,
  setPriceRangeIndex,
}: {
  data: DataPoint[];
  xrpPrices: XrpPrices;
  setPriceRangeIndex: (index: number) => void;
}) {
  const xSumZ = d3.rollup(
    data,
    (v) => d3.sum(v, (d) => d.Z),
    (d) => d.X
  );

  const minX = 0;
  const maxX = 19;

  const nonZeroXrpPrices = Object.fromEntries(
    Object.entries(xrpPrices).filter(([, value]) => value !== 0)
  );

  return (
    <div className="flex flex-col">
      <Plot
        onClick={(data) => {
          if (data.points[0].x !== 10) {
            alert("You can only bet on epoch 10 for the demo.");
          } else {
            setPriceRangeIndex(Number(data.points[0].y));
          }
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
              cmin: 0,
              cmax: 10,
            },
            type: "scatter",
            name: "Data Points",
          },
          {
            x: Object.keys(nonZeroXrpPrices)
              .slice(0, 10)
              .map((key) => Number(key)),
            y: Object.values(nonZeroXrpPrices).slice(0, 10),
            mode: "lines+markers",
            line: { color: "red", width: 2 },
            marker: { size: 8, color: "red" },
            name: "Past Data",
            showlegend: false,
          },
        ]}
        layout={{
          paper_bgcolor: "rgba(0,0,0,0)",
          height: 600,
          width: width + 40,
          showlegend: false,
          xaxis: {
            type: "linear",
            range: [minX, maxX],
            showgrid: false,
            fixedrange: true,
          },
          yaxis: {
            range: [49.5, 60.5],
            dtick: 1,
            showgrid: false,
            fixedrange: true,
          },
          shapes: [
            {
              type: "line",
              x0: 10,
              y0: 0,
              x1: 10,
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
              x: minX,
              y: 10.5,
              text: "Past",
              showarrow: false,
              yanchor: "bottom",
              xref: "x",
              yref: "y",
            },
            {
              x: maxX,
              y: 10.5,
              text: "Future (Predicted)",
              showarrow: false,
              yanchor: "bottom",
              xref: "x",
              yref: "y",
            },
            {
              x: 5,
              y: 10.5,
              text: "Past",
              showarrow: false,
              yanchor: "bottom",
              xref: "x",
              yref: "y",
            },
            {
              x: 15,
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
            name: "Sum(Z) by X",
          },
        ]}
        layout={{
          paper_bgcolor: "rgba(0,0,0,0)",
          height: 400,
          width: width,
          showlegend: false,
          xaxis: {
            type: "linear",
            range: [minX, maxX],
          },
          yaxis: {},
          shapes: [
            {
              type: "line",
              x0: 10,
              y0: 0,
              x1: 10,
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
