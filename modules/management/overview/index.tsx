"use client";

import Chart from "react-apexcharts";
import { ApexOptions, ApexPlotOptions } from "apexcharts";
import { formatPrice } from "@/lib/utils";

export function Overview() {
  const options: ApexOptions = {
    chart: {
      id: "chart",
    },
    series: [
      { data: [220900, 1038300, 0], name: "DONE" },
      { data: [0, 0, 260500], name: "PAYING" },
      { data: [0, 161500, 361000], name: "PREPARING" },
    ],
    xaxis: {
      categories: [
        "2026-05-17T17:00:00Z",
        "2026-05-18T17:00:00Z",
        "2026-05-19T17:00:00Z",
      ],
      title: { text: "Ngày" },
    },
    plotOptions: {
      bar: {
        columnWidth: 20,
        borderRadiusApplication: "around",
        borderRadius: 10,
        dataLabels: {
          position: "top",
          orientation: "vertical",
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["oklch(70.8% 0 0)"],
      },
      offsetY: 10,
      formatter: function (value) {
        if (Number.isInteger(value)) {
          const valueInt = value as number;
          if (valueInt < 1000) {
            return value;
          } else if (valueInt < 1000000) {
            return (valueInt / 1000).toFixed(2) + "K";
          } else if (valueInt < 1000000000) {
            return (valueInt / 1000000).toFixed(2) + "M";
          }
          return (valueInt / 1000000000).toFixed(2) + "B";
        }
        return value;
      },
    },
  };

  return (
    <div>
      <div className="max-w-4xl bg-white rounded-2xl p-3 border border-neutral-200">
        <Chart
          options={options}
          height="380"
          type="bar"
          series={options.series}
        />
      </div>
    </div>
  );
}
