import * as React from "react";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const LineChartDotsComponent = ({ data }) => {
  const chartConfig = {
    totalAmount: {
      label: "Total",
      color: "hsl(221, 83%, 53%)",
    },
  };

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Transações do dia atual</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="chart-container mx-auto max-h-[250px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickLine={true}
                  axisLine={true}
                  tickMargin={8}
                  interval="preserveStartEnd"
                  ticks={[-50, -25, 0, 25, 50, 75, 100]}
                />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="totalAmount"
                  type="monotone"
                  stroke={chartConfig.totalAmount.color}
                  strokeWidth={2}
                  dot={{
                    fill: chartConfig.totalAmount.color,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                >
                  <LabelList
                    position="top"
                    offset={10}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Apresentando transações realizadas no dia atual.
        </div>
      </CardFooter>
    </Card>
  );
};

export default LineChartDotsComponent;
