import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Row, Col, Card, Select, Typography } from 'antd';
import '../../config/chartConfig';
import { Container } from "../../components";

const { Title, Text } = Typography;
const { Option } = Select;

const Dashboard = () => {
    const dataHoraAtual = {
        labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
        datasets: [
            {
                label: 'Qtde/Transações',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                fill: true,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    const dataSeteDias = {
        labels: ['5', '6', '7', '8', '9', '10', '11'],
        datasets: [
            {
                label: 'Qtde/Transações',
                data: [8, 6, 8, 14, 14, 14, 14],
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

    const dataPie = {
        labels: ['Aprovadas', 'Rejeitadas', 'Canceladas', 'Pendentes'],
        datasets: [
            {
                data: [0, 0, 16, 12],
                backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#9e9e9e'],
                hoverBackgroundColor: ['#66bb6a', '#ffb74d', '#e57373', '#bdbdbd'],
            },
        ],
    };

    return (
        <div>
            <Container>

                <Title level={3}>Transações nos últimos 7 dias de 05/07/2024 até 12/07/2024</Title>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card>
                            <Text>Aprovadas</Text>
                            <Title level={4} style={{ color: '#4caf50' }}>R$ 0,00</Title>
                            <Text style={{ color: '#4caf50' }}>0 transações</Text>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Text>Rejeitadas</Text>
                            <Title level={4} style={{ color: '#ff9800' }}>R$ 0,00</Title>
                            <Text style={{ color: '#ff9800' }}>0 transações</Text>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Text>Canceladas</Text>
                            <Title level={4} style={{ color: '#f44336' }}>R$ 3.001,50</Title>
                            <Text style={{ color: '#f44336' }}>16 transações</Text>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Text>Pendentes</Text>
                            <Title level={4} style={{ color: '#9e9e9e' }}>R$ 968,52</Title>
                            <Text style={{ color: '#9e9e9e' }}>12 transações</Text>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={24}>
                        <Select defaultValue="7 Dias" style={{ width: 120, float: 'right' }}>
                            <Option value="7 Dias">7 Dias</Option>
                            <Option value="15 Dias">15 Dias</Option>
                            <Option value="30 Dias">30 Dias</Option>
                        </Select>
                    </Col>
                </Row>

                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={8}>
                        <Card title="Transações por hora no dia atual">
                            <Line data={dataHoraAtual} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Transações por dia nos últimos 7 Dias">
                            <Bar data={dataSeteDias} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Transações por estado nos últimos 7 Dias">
                            <Pie data={dataPie} />
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;