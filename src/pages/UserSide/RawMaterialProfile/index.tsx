import React, { useState } from 'react';
import { Button, Typography, Row, Col, Card, Progress, Table } from 'antd';
import './StockAnalysis.less';
import { DollarOutlined,ArrowRightOutlined,ArrowUpOutlined,ArrowDownOutlined,CheckCircleOutlined} from '@ant-design/icons'; 
import { ProTable } from '@ant-design/pro-components';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Line } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { Legend } from 'recharts';
import ChatGPTLogo from '../../../assets/CHATGPTLOGO WITH NO BACKGROUND.png';
const { Title, Text } = Typography;
const RawMaterialProfile = () => {
  const [isProductsView] = useState(false); // State to track Products or Raw Materials view
    // Data for the bar chart
    const data = [
        { month: 'January', demand: 5, production: 6, runRate: 5.5 },
        { month: 'February', demand: 7, production: 8, runRate: 7.5 },
        { month: 'March', demand: 4, production: 3, runRate: 3.5 },
        { month: 'April', demand: 9, production: 10, runRate: 9.5 },
        { month: 'May', demand: 6, production: 7, runRate: 6.5 },
        { month: 'June', demand: 8, production: 9, runRate: 8.5 },
        { month: 'July', demand: 3, production: 4, runRate: 3.5 },
        { month: 'August', demand: 6, production: 5, runRate: 5.5 },
        { month: 'September', demand: 10, production: 11, runRate: 10.5 },
        { month: 'October', demand: 5, production: 6, runRate: 5.5 },
        { month: 'November', demand: 7, production: 8, runRate: 7.5 },
        { month: 'December', demand: 9, production: 10, runRate: 9.5 },
      ];
      const salesData = [
        { country: 'USA', sales: 3000, percentage: 20, increase: true },
        { country: 'Canada', sales: 2500, percentage: -15, increase: false },
        { country: 'UK', sales: 2000, percentage: 10, increase: true },
        { country: 'Germany', sales: 1500, percentage: -5, increase: false },
        { country: 'Australia', sales: 3500, percentage: 30, increase: true }
      ];
    // Columns for the ProTable
    const proTableColumns = [
      { title: isProductsView ? 'Product' : 'Raw Material', dataIndex: 'product', key: 'product', sorter: true,className:'table-column-title' },
      { title: 'Stock Available', dataIndex: 'stock', key: 'stock', sorter: true,className:'table-column-title' },
      { title: 'In Transit', dataIndex: 'transit', key: 'transit', sorter: true,className:'table-column-title' },
      { title: 'Monthly Demand', dataIndex: 'demand', key: 'demand', sorter: true,className:'table-column-title' },
      { title: 'Stock Cover (mos)', dataIndex: 'stockCover', key: 'stockCover', sorter: true,className:'table-column-title' },
      { title: 'Delivery Forecast', dataIndex: 'forecast', key: 'forecast', sorter: true,className:'table-column-title' },
      { title: 'Risk Level', dataIndex: 'risk', key: 'risk', sorter: true, render: (risk) => {
        let color;
        if (risk === 'Overstocked') color = 'yellow';
        if (risk === 'Well Stocked') color = 'darkgreen';
        if (risk === 'Understocked') color = 'red';
        return <span style={{ color }}>{risk}</span>;
      }, },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: () => (
          <Button type="link" onClick={() => window.location.href = '/supplier-profile'}>
            <ArrowRightOutlined/>
          </Button>
        ),
      },
    ];
  
    const proTableData = [
      { key: 1, product: 'Vaseline body lotion 200ml', stock: 23000, transit: 85000, demand: 18200, stockCover: 1.3, forecast: '10 days', risk: 'Overstocked' },
      { key: 2, product: 'Vaseline body lotion 200ml', stock: 23000, transit: 85000, demand: 18200, stockCover: 1.3, forecast: '10 days', risk: 'Well Stocked' },
      { key: 2, product: 'Vaseline body lotion 200ml', stock: 23000, transit: 85000, demand: 18200, stockCover: 1.3, forecast: '10 days', risk: 'Well Stocked' },
      { key: 2, product: 'Vaseline body lotion 200ml', stock: 23000, transit: 85000, demand: 18200, stockCover: 1.3, forecast: '10 days', risk: 'Understocked' },
    ];
  
  return (
    <div className="stock-analysis-container">
      <Row justify="space-between" align="middle">
        <Col>
          <div className="title-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <h4 style={{
    fontFamily: 'Poppins',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '14.4px',
    textAlign: 'left',
    color: '#334155',
    padding: '10px',
    margin: 0
  }}>
    Stock Analysis
  </h4>
  <ArrowRightOutlined style={{ color: '#64748B' }} />
  <h4 style={{
    fontFamily: 'Poppins',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '14.4px',
    textAlign: 'left',
    color: '#64748B',
    margin: 0
  }}>
    Product Profile
  </h4>
</div>
            <Text className="stock-subtitle">
            <h2 style={{
          fontFamily: 'Poppins',
          fontSize: '24px',
          fontWeight: '600',
          lineHeight: '28.8px',
          color: '#00263E',
          margin: '20px 0',
        }}>
          Vaseline Blue Lotion 200ml (UL292390D)
        </h2>
            </Text>
          </div>
        </Col>
      </Row>
      <br/>
      {/* Cards Section */}
         <Row gutter={[14, 14]}>
        <Col span={3}>
          <Card title="Inventory Level" className="inventory-level-card">
            <Progress type="circle" percent={57} strokeColor="orange" />
            <br/>
            <Text className="centered-text">Valued at $50,000</Text>
          </Card>
          <br/>
        </Col>
        <Col span={9}>
        <Card className="custom-card chat-gpt-card" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div className="icon-section">
          <img src={ChatGPTLogo} alt="ChatGPT Logo" className="chat-gpt-logo" /> {/* ChatGPT Logo */}
        </div>
        <div className="content-section">
          <Title level={3} className="chat-gpt-data">General Product Insights</Title>
          <Text className="additional-info">
            Product: XYZ Widget
          </Text>
          <Text className="additional-info">
            Market Share: 25%
          </Text>
          <Text className="additional-info">
            Avg. Monthly Sales: 50,000 units
          </Text>
          <Text className="additional-info">
            Predicted Growth: 15% Q4
          </Text>
        </div>
      </Card>
      {/* Row for the other 4 cards */}
      <Row gutter={[16, 16]}>
        {/* First Row of 2 cards */}
        <Col span={12}>
          <Card className="custom-cards">
            <div className="icon-section">
              <DollarOutlined className="blue-icon" /> {/* Dollar Icon */}
            </div>
            <div className="content-section">
              <Title level={3} className="amount-display">50,000</Title>
              <Text className="item-count">(18)</Text>
              <Text className="deliveries-info">Expected Deliveries</Text>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card className="custom-cards">
            <div className="icon-section">
              <DollarOutlined className="blue-icon" />
            </div>
            <div className="content-section">
              <Title level={3} className="amount-display">30,000</Title>
              <Text className="item-count">(10)</Text>
              <Text className="deliveries-info">In Progress Deliveries</Text>
            </div>
          </Card>
        </Col>

        {/* Second Row of 2 cards */}
        <Col span={12}>
          <Card className="custom-cards">
            <div className="icon-section">
              <DollarOutlined className="blue-icon" />
            </div>
            <div className="content-section">
              <Title level={3} className="amount-display">40,000</Title>
              <Text className="item-count">(12)</Text>
              <Text className="deliveries-info">Completed Deliveries</Text>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card className="custom-cards">
            <div className="icon-section">
              <DollarOutlined className="blue-icon" />
            </div>
            <div className="content-section">
              <Title level={3} className="amount-display">20,000</Title>
              <Text className="item-count">(5)</Text>
              <Text className="deliveries-info">Pending Deliveries</Text>
            </div>
          </Card>
        </Col>
      </Row>
        </Col>
          <Col span={12}>
        <Card 
          title={<h2 style={{ color: '#1f4056', fontFamily: 'Poppins', fontWeight: 600 }}>MONTHLY DEMAND VS PRODUCTION</h2>} 
          className="centered-card"
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                label={{ value: 'Value (000)', angle: -90, position: 'insideLeft' }}
                ticks={[0, 5, 10]}
              />
              <Tooltip />
              <Legend verticalAlign="top" />
              <Bar dataKey="demand" fill="#184053" name="Demand" />
              <Bar dataKey="production" fill="#d9c2a1" name="Production" />
              <Line type="monotone" dataKey="runRate" stroke="#ffb200" name="Run Rate" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#184053', marginRight: '5px' }} />
              <span>Demand</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#d9c2a1', marginRight: '5px' }} />
              <span>Production</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '20px', height: '2px', backgroundColor: '#ffb200', marginRight: '5px' }} />
              <span>Run Rate</span>
            </div>
          </div>
        </Card>
        </Col>
      </Row>
      <br/>
          <Row gutter={[18, 18]}>
      {/* Column for ProTable */}
      <Col span={24}>
      <br/>
        <Card title={isProductsView ? "Products to Restock" : "Raw Materials to Restock"} className="centered-card">
          <ProTable
            columns={proTableColumns}
            dataSource={proTableData}
            rowKey="key"
            search={false}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </Col>
    </Row>
    <br/>     
    <Col span={24}>
      <br/>
        <Card title={isProductsView ? "Products to Restock" : "Raw Materials to Restock"} className="centered-card">
          <ProTable
            columns={proTableColumns}
            dataSource={proTableData}
            rowKey="key"
            search={false}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </Col>
    </div>
  );
};
export default RawMaterialProfile;
