import React, { useState } from "react";
import { Row, Col, Select, DatePicker } from "antd";
import { Container, OverviewCard, RecentSales } from "../../components";
import {
  BarChartComponent,
  PieChartComponent,
  LineChartComponent,
  LineChartDotsComponent,
} from "../../components/Charts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  TrendingUp,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import "./styles.css";

const { RangePicker } = DatePicker;
const { Option } = Select;

export function Dashboard() {
  const [dateRange, setDateRange] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState("week");

  return (
    <div className="bg-gray-50 dark:bg-slate-900 pb-12">
      <Container>
        <div className="py-6">
          {/* Header com título e filtros */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Visão geral da performance de transações
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                defaultValue="week"
                onChange={setFilterPeriod}
                className="min-w-[150px]"
                suffixIcon={<Filter className="w-4 h-4 text-slate-400" />}
              >
                <Option value="today">Hoje</Option>
                <Option value="week">Esta semana</Option>
                <Option value="month">Este mês</Option>
                <Option value="quarter">Este trimestre</Option>
                <Option value="year">Este ano</Option>
                <Option value="custom">Personalizado</Option>
              </Select>

              {filterPeriod === "custom" && (
                <RangePicker
                  onChange={setDateRange}
                  className="min-w-[250px]"
                />
              )}

              <button className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>

          {/* Cards de métricas */}
          <Row gutter={[16, 16]} className="mb-8">
            <Col xs={24} sm={12} md={6}>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Aprovadas
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                      $0.00
                    </h3>
                  </div>
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    0 transações
                  </span>
                  <div className="ml-auto flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="w-3 h-3" />
                    0%
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Rejeitos
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                      $0.00
                    </h3>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    0 transações
                  </span>
                  <div className="ml-auto flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                    <ArrowUpRight className="w-3 h-3" />
                    0%
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Canceladas
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                      $0.00
                    </h3>
                  </div>
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    0 transações
                  </span>
                  <div className="ml-auto flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <ArrowDownRight className="w-3 h-3" />
                    0%
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Pendentes
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                      $0.00
                    </h3>
                  </div>
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    0 transações
                  </span>
                  <div className="ml-auto flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                    <ArrowDownRight className="w-3 h-3" />
                    0%
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Gráficos */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Análise de Transações
            </h2>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={8}>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-slate-800 dark:text-white">
                      Transações por Status
                    </h3>
                    <Select defaultValue="week" className="w-24" size="small">
                      <Option value="week">Semana</Option>
                      <Option value="month">Mês</Option>
                      <Option value="year">Ano</Option>
                    </Select>
                  </div>
                  <BarChartComponent />
                </div>
              </Col>

              <Col xs={24} md={12} lg={8}>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-slate-800 dark:text-white">
                      Distribuição por Tipo
                    </h3>
                    <Select defaultValue="week" className="w-24" size="small">
                      <Option value="week">Semana</Option>
                      <Option value="month">Mês</Option>
                      <Option value="year">Ano</Option>
                    </Select>
                  </div>
                  <PieChartComponent />
                </div>
              </Col>

              <Col xs={24} lg={8}>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-slate-800 dark:text-white">
                      Tendência de Transações
                    </h3>
                    <Select defaultValue="week" className="w-24" size="small">
                      <Option value="week">Semana</Option>
                      <Option value="month">Mês</Option>
                      <Option value="year">Ano</Option>
                    </Select>
                  </div>
                  <LineChartDotsComponent />
                </div>
              </Col>
            </Row>
          </div>

          {/* Gráfico grande */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Performance ao Longo do Tempo
            </h2>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-slate-800 dark:text-white">
                  Volume de Transações
                </h3>
                <Select defaultValue="month" className="w-32" size="small">
                  <Option value="week">Semana</Option>
                  <Option value="month">Mês</Option>
                  <Option value="quarter">Trimestre</Option>
                  <Option value="year">Ano</Option>
                </Select>
              </div>
              <LineChartComponent />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;
