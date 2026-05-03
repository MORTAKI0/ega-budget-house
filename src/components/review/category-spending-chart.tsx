"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/currency";

type CategorySpendingChartProps = {
  data: Array<{ category: string; total: number }>;
  currency: string;
};

export function CategorySpendingChart({ data, currency }: CategorySpendingChartProps) {
  const chartHeight = Math.max(240, data.length * 48);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const element = chartRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setChartWidth(Math.max(1, Math.floor(element.getBoundingClientRect().width)));
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-emerald-100 bg-white p-2">
      <div
        ref={chartRef}
        className="h-64 min-h-[240px] w-full min-w-0 overflow-hidden"
        style={{ height: chartHeight }}
      >
        {chartWidth > 0 ? (
          <BarChart
            data={data}
            width={chartWidth}
            height={chartHeight}
            layout="vertical"
            margin={{ top: 8, right: 72, bottom: 8, left: 8 }}
          >
            <CartesianGrid horizontal={false} stroke="#e4e4e7" strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickFormatter={(value) => formatCurrency(Number(value), currency)}
              tick={{ fill: "#52525b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <YAxis
              dataKey="category"
              type="category"
              tick={{ fill: "#27272a", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={96}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value), currency), "Spent"]}
              labelClassName="font-medium text-zinc-950"
              contentStyle={{
                borderRadius: "12px",
                borderColor: "#d1fae5",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Bar dataKey="total" fill="#047857" radius={[0, 8, 8, 0]} maxBarSize={28}>
              <LabelList
                dataKey="total"
                position="right"
                formatter={(value) => formatCurrency(Number(value ?? 0), currency)}
                style={{ fill: "#065f46", fontSize: 11, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        ) : null}
      </div>
    </div>
  );
}
