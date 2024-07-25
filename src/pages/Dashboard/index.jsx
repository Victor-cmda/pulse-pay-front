import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { Container, OverviewCard, RecentSales } from "../../components";
import {
  BarChartComponent,
  PieChartComponent,
  LineChartComponent,
  LineChartDotsComponent,
} from "../../components/Charts";
import "./styles.css";
import PulseService from "../../services/PulseService";
import LoadingSkeleton from "../../components/LoadingSkeleton";

export function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const dashboardData = await PulseService.getDashboard();
      setData({ ...dashboardData.data });
      if (dashboardData.success) {
      } else {
        console.error("Erro ao buscar dados da API:", result.message);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <Container>
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
            <BarChartComponent data={data.barChartData} />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <PieChartComponent data={data.pieChartData} />
          </Col>
          <Col xs={24} lg={8}>
            <LineChartDotsComponent data={data.lineChartDotsData} />
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="mt-8">
          <Col span={24}>
            <LineChartComponent data={data.lineChartData} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
