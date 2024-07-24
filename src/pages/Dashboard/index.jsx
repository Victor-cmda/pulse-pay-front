import React from "react";
import { Row, Col } from "antd";
import { Container, OverviewCard, RecentSales } from "../../components";
import {
  BarChartComponent,
  PieChartComponent,
  LineChartComponent,
  LineChartDotsComponent,
} from "../../components/Charts";
import "./styles.css";

export function Dashboard() {
  return (
    <div>
      <Container>
        {/* <h1 className="text-3xl font-bold mb-8">Dashboard</h1> */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <OverviewCard
              title="Aprovadas"
              value="$0.00"
              subValue="0 transações"
              color="green-500"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <OverviewCard
              title="Rejeitos"
              value="$0.00"
              subValue="0 transações"
              color="blue-500"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <OverviewCard
              title="Canceladas"
              value="$0.00"
              subValue="0 transações"
              color="yellow-500"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <OverviewCard
              title="Pendentes"
              value="$0.00"
              subValue="0 transações"
              color="red-500"
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="mt-8">
          <Col xs={24} md={12} lg={8}>
            <BarChartComponent />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <PieChartComponent />
          </Col>
          <Col xs={24} lg={8}>
            <LineChartDotsComponent />
          </Col>
          {/* <Col xs={24} lg={8}>
            <RecentSales />
          </Col> */}
        </Row>
        <Row gutter={[16, 16]} className="mt-8">
          <Col span={24}>
            <LineChartComponent />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
