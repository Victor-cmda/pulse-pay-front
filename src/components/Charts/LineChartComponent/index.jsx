import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  transactions: {
    label: "Transações",
  },
  credit: {
    label: "Crédito",
    color: "hsl(var(--chart-1))",
  },
  bankSlip: {
    label: "Boleto Bancário",
    color: "hsl(var(--chart-2))",
  },
  pix: {
    label: "Pix",
    color: "hsl(var(--chart-3))",
  },
};

const LineChartComponent = ({ data }) => {
  const [activeChart, setActiveChart] = React.useState("pix");

  const total = React.useMemo(() => {
    if (!data || data.length === 0) {
      return {
        credit: 0,
        bankSlip: 0,
        pix: 0,
      };
    }

    return {
      credit: data.reduce((acc, curr) => acc + (curr.credit || 0), 0),
      bankSlip: data.reduce((acc, curr) => acc + (curr.bankSlip || 0), 0),
      pix: data.reduce((acc, curr) => acc + (curr.pix || 0), 0),
    };
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Transações nos últimos 30 dias</CardTitle>
          <CardDescription>
            Apresentando separadamente as transações de crédito, boleto bancário
            e pix.
          </CardDescription>
        </div>
        <div className="flex">
          {["credit", "bankSlip", "pix"].map((key) => {
            const chart = key;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="transactions"
                    labelFormatter={(value, props) => {
                      const date = new Date(props[0].payload.date);
                      return date.toLocaleDateString("pt-BR", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Line
                dataKey={activeChart}
                type="monotone"
                stroke={`var(--color-${activeChart})`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default LineChartComponent;
