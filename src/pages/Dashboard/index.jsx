import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
import { Container, OverviewCard, RecentSales } from "../../components";
import { Row, Col } from "antd";
import { TrendingUp } from "lucide-react";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

export function Dashboard() {
  return (
    <div>
      <Container>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <Row gutter={16}>
          <Col span={6}>
            <OverviewCard
              title="Total Revenue"
              value="$45,231.89"
              subValue="+20.1% from last month"
              color="green-500"
            />
          </Col>
          <Col span={6}>
            <OverviewCard
              title="Subscriptions"
              value="+2350"
              subValue="+180.1% from last month"
              color="blue-500"
            />
          </Col>
          <Col span={6}>
            <OverviewCard
              title="Sales"
              value="+12,234"
              subValue="+19% from last month"
              color="yellow-500"
            />
          </Col>
          <Col span={6}>
            <OverviewCard
              title="Active Now"
              value="+573"
              subValue="+201 since last hour"
              color="red-500"
            />
          </Col>
        </Row>
        <Row gutter={16} className="mt-8">
          <Col span={8}>
            <Card>
              <CardHeader>
                <CardTitle>Bar Chart</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar
                        dataKey="desktop"
                        fill="var(--color-desktop)"
                        radius={8}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing total visitors for the last 6 months
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col span={8}>
            <RecentSales />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
