"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { GridComponent, RadarComponent, TooltipComponent, type GridComponentOption, type RadarComponentOption, type TooltipComponentOption } from "echarts/components";
import { RadarChart, ScatterChart, type RadarSeriesOption, type ScatterSeriesOption } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

import type { DiagnosisResult } from "@/lib/validations/survey";

echarts.use([CanvasRenderer, GridComponent, RadarComponent, RadarChart, ScatterChart, TooltipComponent]);

type ChartOption = echarts.ComposeOption<
  GridComponentOption | RadarComponentOption | TooltipComponentOption | RadarSeriesOption | ScatterSeriesOption
>;

type ChartContainerProps = {
  className?: string;
  option: ChartOption;
};

type TooltipPoint = {
  data?: unknown;
  name?: string;
};

function ChartContainer({ className, option }: ChartContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const chart = echarts.init(containerRef.current, undefined, {
      renderer: "canvas",
    });
    chartRef.current = chart;
    chart.setOption(option);

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, [option]);

  return <div ref={containerRef} className={className ?? "h-[260px] w-full"} role="img" />;
}

export function AIHealthRadarChart({ items }: { items: DiagnosisResult["dimensionReports"] }) {
  const option: ChartOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      borderWidth: 0,
      backgroundColor: "rgba(15, 23, 42, 0.92)",
      textStyle: {
        color: "#fff7ed",
        fontSize: 12,
      },
    },
    radar: {
      center: ["50%", "56%"],
      radius: "56%",
      splitNumber: 4,
      indicator: items.map((item) => ({
        name: item.name,
        max: 100,
      })),
      axisName: {
        color: "rgba(255,255,255,.78)",
        fontSize: 11,
        lineHeight: 15,
        width: 84,
        overflow: "breakAll",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,.16)",
        },
      },
      splitLine: {
        lineStyle: {
          color: ["rgba(255,255,255,.08)", "rgba(255,255,255,.12)", "rgba(245,158,11,.22)", "rgba(245,158,11,.32)"],
        },
      },
      splitArea: {
        areaStyle: {
          color: ["rgba(255,255,255,.02)", "rgba(255,255,255,.04)"],
        },
      },
    },
    series: [
      {
        type: "radar",
        symbol: "circle",
        symbolSize: 8,
        data: [
          {
            name: "AI 转型健康度",
            value: items.map((item) => item.score),
            areaStyle: {
              color: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.9,
                colorStops: [
                  { offset: 0, color: "rgba(251,191,36,.52)" },
                  { offset: 1, color: "rgba(249,115,22,.08)" },
                ],
              },
            },
            lineStyle: {
              width: 3,
              color: "#f59e0b",
              shadowBlur: 16,
              shadowColor: "rgba(245,158,11,.55)",
            },
            itemStyle: {
              color: "#fff7ed",
              borderColor: "#f59e0b",
              borderWidth: 2,
              shadowBlur: 12,
              shadowColor: "rgba(245,158,11,.55)",
            },
          },
        ],
      },
    ],
  };

  return <ChartContainer className="h-[260px] w-full" option={option} />;
}

export function PriorityMatrixChart({ items }: { items: DiagnosisResult["visualAnalysis"]["priorityMatrix"] }) {
  const maxSignal = Math.max(...items.map((item) => item.impact + item.feasibility), 1);
  const option: ChartOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      borderWidth: 0,
      backgroundColor: "rgba(15, 23, 42, 0.94)",
      formatter: (params) => {
        const point = (Array.isArray(params) ? params[0] : params) as
          | (TooltipPoint & { data?: { value?: unknown } | unknown[] })
          | undefined;
        const rawValue = Array.isArray(point?.data)
          ? point?.data
          : point?.data && typeof point.data === "object" && "value" in point.data
            ? point.data.value
            : undefined;
        const data = Array.isArray(rawValue) ? rawValue : [];
        return `${point?.name ?? "推荐场景"}<br/>业务影响：${data[1] ?? "-"}<br/>落地可行性：${data[0] ?? "-"}`;
      },
      textStyle: {
        color: "#fff7ed",
        fontSize: 12,
      },
    },
    grid: {
      top: 20,
      right: 18,
      bottom: 34,
      left: 36,
    },
    xAxis: {
      min: 0,
      max: 100,
      name: "可行性",
      nameTextStyle: {
        color: "rgba(255,255,255,.55)",
      },
      axisLabel: {
        color: "rgba(255,255,255,.48)",
        fontSize: 10,
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,.12)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,.08)",
        },
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      name: "影响",
      nameTextStyle: {
        color: "rgba(255,255,255,.55)",
      },
      axisLabel: {
        color: "rgba(255,255,255,.48)",
        fontSize: 10,
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,.12)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,.08)",
        },
      },
    },
    series: [
      {
        type: "scatter",
        data: items.map((item) => ({
          name: item.label,
          value: [item.feasibility, item.impact, Math.round(((item.impact + item.feasibility) / maxSignal) * 100)],
          symbolSize: 28 + ((item.impact + item.feasibility) / maxSignal) * 34,
          itemStyle: {
            color: item.recommendation.includes("优先") ? "rgba(245,158,11,.88)" : "rgba(56,189,248,.72)",
            borderColor: "rgba(255,255,255,.9)",
            borderWidth: 1,
            shadowBlur: 24,
            shadowColor: item.recommendation.includes("优先") ? "rgba(245,158,11,.45)" : "rgba(56,189,248,.34)",
          },
          label: {
            show: true,
            formatter: item.label,
            color: "#fff7ed",
            fontSize: 11,
            position: "top",
          },
        })),
      },
    ],
  };

  return <ChartContainer className="h-[260px] w-full" option={option} />;
}
