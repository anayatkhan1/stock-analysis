"use client";
import { Logo } from "@/components/logo";
import { Activity, Map as MapIcon, MessageCircle } from "lucide-react";
import DottedMap from "dotted-map";
import { Area, AreaChart, CartesianGrid } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function FeaturesSection() {
  return (
    <section className="px-4 py-16 md:py-32">
      <div className="mx-auto grid max-w-5xl border md:grid-cols-2">
        <div>
          <div className="p-6 sm:p-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <MapIcon className="size-4" />
              Global Market Coverage
            </span>

            <p className="mt-8 text-2xl font-semibold">
              Comprehensive market data, instantly track stocks across global
              exchanges.
            </p>
          </div>

          <div aria-hidden className="relative">
            <div className="absolute inset-0 z-10 m-auto size-fit">
              <div className="rounded-(--radius) bg-background z-1 dark:bg-muted relative flex size-fit w-fit items-center gap-2 border px-3 py-1 text-xs font-medium shadow-md shadow-zinc-950/5">
                <span className="text-lg">🇨🇩</span> Latest update: NYSE market
                Surge
              </div>
              <div className="rounded-(--radius) bg-background absolute inset-2 -bottom-2 mx-auto border px-3 py-4 text-xs font-medium shadow-md shadow-zinc-950/5 dark:bg-zinc-900"></div>
            </div>

            <div className="relative overflow-hidden">
              <div className="bg-radial z-1 to-background absolute inset-0 from-transparent to-75%"></div>
              <Map />
            </div>
          </div>
        </div>
        <div className="overflow-hidden border-t bg-zinc-50 p-6 sm:p-12 md:border-0 md:border-l dark:bg-transparent">
          <div className="relative z-10">
            <span className="text-muted-foreground flex items-center gap-2">
              <MessageCircle className="size-4" />
              Expert Financial Support
            </span>

            <p className="my-8 text-2xl font-semibold">
              Connect with financial analysts for personalized investment
              guidance.
            </p>
          </div>
          <div aria-hidden className="flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-5 rounded-full border">
                  <Logo className="m-auto size-3" />
                </span>
                <span className="text-muted-foreground text-xs">
                  Sat 22 Feb
                </span>
              </div>
              <div className="rounded-(--radius) bg-background mt-1.5 w-3/5 border p-3 text-xs">
                What's your analysis on the tech sector this quarter?
              </div>
            </div>

            <div>
              <div className="rounded-(--radius) mb-1 ml-auto w-3/5 bg-blue-600 p-3 text-xs text-white">
                Our analysis shows strong growth potential in cloud computing
                and semiconductor stocks. We recommend increasing allocation in
                these areas.
              </div>
              <span className="text-muted-foreground block text-right text-xs">
                Now
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-full border-y p-12">
          <p className="text-center text-4xl font-semibold lg:text-7xl">
            98.7% Accuracy
          </p>
        </div>
        <div className="relative col-span-full">
          <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <Activity className="size-4" />
              Market Performance
            </span>

            <p className="my-8 text-2xl font-semibold">
              Track stock performance in real-time.{" "}
              <span className="text-muted-foreground">
                {" "}
                Instantly identify trends and investment opportunities.
              </span>
            </p>
          </div>
          <MonitoringChart />
        </div>
      </div>
    </section>
  );
}

const map = new DottedMap({ height: 55, grid: "diagonal" });

const points = map.getPoints();

const svgOptions = {
  backgroundColor: "var(--color-background)",
  color: "currentColor",
  radius: 0.15,
};

const Map = () => {
  const viewBox = `0 0 120 60`;
  return (
    <svg viewBox={viewBox} style={{ background: svgOptions.backgroundColor }}>
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={svgOptions.radius}
          fill={svgOptions.color}
        />
      ))}
    </svg>
  );
};

const chartConfig = {
  stocks: {
    label: "Stocks",
    color: "#2563eb",
  },
  indices: {
    label: "Market Indices",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "May", stocks: 56, indices: 224 },
  { month: "June", stocks: 56, indices: 224 },
  { month: "January", stocks: 126, indices: 252 },
  { month: "February", stocks: 205, indices: 410 },
  { month: "March", stocks: 200, indices: 126 },
  { month: "April", stocks: 400, indices: 800 },
];

const MonitoringChart = () => {
  return (
    <ChartContainer className="h-120 aspect-auto md:h-96" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 0,
          right: 0,
        }}
      >
        <defs>
          <linearGradient id="fillStocks" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-stocks)"
              stopOpacity={0.8}
            />
            <stop
              offset="55%"
              stopColor="var(--color-stocks)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillIndices" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-indices)"
              stopOpacity={0.8}
            />
            <stop
              offset="55%"
              stopColor="var(--color-indices)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          active
          cursor={false}
          content={<ChartTooltipContent className="dark:bg-muted" />}
        />
        <Area
          strokeWidth={2}
          dataKey="indices"
          type="stepBefore"
          fill="url(#fillIndices)"
          fillOpacity={0.1}
          stroke="var(--color-indices)"
          stackId="a"
        />
        <Area
          strokeWidth={2}
          dataKey="stocks"
          type="stepBefore"
          fill="url(#fillStocks)"
          fillOpacity={0.1}
          stroke="var(--color-stocks)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};
