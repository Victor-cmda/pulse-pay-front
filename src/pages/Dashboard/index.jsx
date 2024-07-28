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
              title="Aprovadas (R$)"
              value={data.overviewData.approvedAmount}
              subValue={`${data.overviewData.approvedCount} transações`}
              color="#1f9b79"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <OverviewCard
              title="Rejeitos (R$)"
              value={data.overviewData.rejectedAmount}
              subValue={`${data.overviewData.rejectedCount} transações`}
              color="#e69e52"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <OverviewCard
              title="Canceladas (R$)"
              value={data.overviewData.cancelledAmount}
              subValue={`${data.overviewData.cancelledCount} transações`}
              color="#ea162d"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <OverviewCard
              title="Pendentes (R$)"
              value={data.overviewData.pendingAmount}
              subValue={`${data.overviewData.pendingCount} transações`}
              color="#7c8074"
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
