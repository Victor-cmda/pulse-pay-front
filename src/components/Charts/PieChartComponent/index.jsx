import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer, Cell  } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const PieChartComponent = ({ data }) => {
  const chartConfig = {
    PIX: {
      label: "Pix",
      color: "hsl(213, 100%, 63%)",
    },
    BANKSLIP: {
      label: "Boleto",
      color: "hsl(210, 98%, 78%)",
    },
    CREDIT: {
      label: "Crédito",
      color: "hsl(221, 83%, 53%)",
    },
  };

  const colors = Object.keys(chartConfig).map((key) => chartConfig[key].color);

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Transações nos ultimos 30 dias</CardTitle>
        <CardDescription>{`${formatDate(thirtyDaysAgo)} - ${formatDate(today)}`}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="chart-container mx-auto max-h-[250px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={data} dataKey="count" nameKey="paymentType">
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Apresentando transações realizadas nos últimos 30 dias.
        </div>
      </CardFooter>
    </Card>
  );
};

export default PieChartComponent;
