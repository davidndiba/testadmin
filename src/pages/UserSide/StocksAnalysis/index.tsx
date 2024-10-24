import React, { useState } from 'react';
import { Button, Typography, Row, Col, Card, Progress, Table } from 'antd';
import './StockAnalysis.less';
import { DollarOutlined,ArrowRightOutlined } from '@ant-design/icons'; 
import { ProTable } from '@ant-design/pro-components';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
const { Title, Text } = Typography;
const StockAnalysis = () => {
  const [isProductsView, setIsProductsView] = useState(false); // State to track Products or Raw Materials view
  const tableColumns = [
    { title: isProductsView ? 'Product Name' : 'Item Name', dataIndex: 'item', key: 'item', width: 230 },
    { title: 'Days to Stockout', dataIndex: 'daysToStockout', key: 'daysToStockout', width: 230 },
    { title: 'Estimated Restock Cost ($)', dataIndex: 'cost', key: 'cost', width: 230 }
  ];
  const tableData = [
    { key: 1, item: 'Diam', daysToStockout: <Progress percent={70} />, cost: '4,000' },
    { key: 2, item: 'Ipsum', daysToStockout: <Progress percent={60} />, cost: '8,500' },
    { key: 3, item: 'Petroleum jelly', daysToStockout: <Progress percent={50} />, cost: '10,080.58' },
    { key: 4, item: 'Parafin wax', daysToStockout: <Progress percent={40} />, cost: '1,000' },
    { key: 5, item: 'Vestibulum', daysToStockout: <Progress percent={30} />, cost: '25,480.66' },
  ];
  const turnoverTableData = [
    { key: 1, item: 'Vestibulum', value: <Progress percent={200} /> },
    { key: 2, item: 'Paraffin wax', value: <Progress percent={170} /> },
    { key: 3, item: 'Petroleum jelly', value: <Progress percent={100} /> },
    { key: 4, item: 'Ipsum', value: <Progress percent={80} /> },
    { key: 5, item: 'Diam', value: <Progress percent={50} /> },
  ];
    // Data for the bar chart
    const barChartData = [
      { name: 'Jan', items: 4 },
      { name: 'Feb', items: 6 },
      { name: 'Mar', items: 3 },
      { name: 'Apr', items: 8 },
      { name: 'May', items: 2 },
      { name: 'Jun', items: 5 },
      { name: 'Jul', items: 7 },
      { name: 'Aug', items: 1 },
      { name: 'Sep', items: 6 },
      { name: 'Oct', items: 9 },
      { name: 'Nov', items: 4 },
      { name: 'Dec', items: 8 },
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
          <Button type="link" onClick={() => window.location.href = '/product-profile'}>
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
            <Title level={2} className="stock-title">Stocks Analysis</Title>
            <Text className="stock-subtitle">
              Monitor stock levels for raw materials and finished products
            </Text>
          </div>
        </Col>
        <Col>
          <div className="button-container">
          <Button 
              className="products-button" 
              shape="round"
              onClick={() => setIsProductsView(true)} //Products view
            >
              Products
            </Button>
            <Button 
              className="raw-materials-button" 
              shape="round"
              onClick={() => setIsProductsView(false)} //Raw Materials view
            >
              Raw Materials
            </Button>
          </div>
        </Col>
      </Row>
      {/* Cards Section */}
         <Row gutter={[14, 14]}>
        <Col span={3}>
          <Card title="Inventory Level" className="inventory-level-card">
            <Progress type="circle" percent={57} strokeColor="orange" />
            <br/>
            <Text className="centered-text">Valued at $50,000</Text>
          </Card>
          <br/>
          {/* Additional card below */}
          <Card className="custom-card">
    <div className="icon-section">
      <DollarOutlined className="blue-icon" /> {/* Use Ant Design's DollarOutlined icon */}
    </div>
    <div className="content-section">
      <Title level={3} className="amount-display">50,000</Title>
      <Text className="item-count">(18)</Text>
      <Text className="deliveries-info">Expected Deliveries</Text>
    </div>
  </Card>
        </Col>
        <Col span={3}>
        <Card title={isProductsView ? "Total Products Tracked" : "Total Items Tracked"} className="centered-card total-items-card">
            <Progress type="circle" percent={isProductsView ? 10 : (487 / (487 + 33)) * 100} strokeColor={isProductsView ? "green" : "green"} />
            <br />
            <div className="stock-info">
              <Text className="left-text">
                <span style={{ color: 'green' }}>{isProductsView ? '7 Well Stocked' : '487 In Stock'}</span>
              </Text>
              <Text className="right-text">
                <span style={{ color: 'red' }}>{isProductsView ? '3 Understocked' : '33 Stocked Out'}</span>
              </Text>
            </div>
          </Card>
          <br/>
          <Card className="custom-card">
    <div className="icon-section">
      <DollarOutlined className="blue-icon" /> {/* Use Ant Design's DollarOutlined icon */}
    </div>
    <div className="content-section">
      <Title level={3} className="amount-display">100,000</Title>
      <Text className="item-count">(18)</Text>
      <Text className="deliveries-info">Inventory at Risk of Expiry</Text>
    </div>
  </Card>
        </Col>
        <Col span={9}>
        <Card title={isProductsView ? "Top Five Products with Lowest Stock" : "Top 5 Items with Lowest Stock"} className="centered-card">
            <Table columns={tableColumns} dataSource={tableData} pagination={false} />
          </Card>
        </Col>
        <Col span={9}>
        <Card title={isProductsView ? "Products with Highest Inventory Turnover" : "Items with Highest Inventory Turnover"} className="centered-card">
            <Table 
              columns={[
                { title: 'Item Name', dataIndex: 'item', key: 'item' },
                { title: 'Approximate Value', dataIndex: 'value', key: 'value' }
              ]}
              dataSource={turnoverTableData}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
      <br/>
      <Row gutter={[16, 16]}>
        {/* Projected Revenue Card */}
        <Col span={6}>
        <Card className="custom-card">
    <div className="icon-section">
      <DollarOutlined className="blue-icon" /> {/* Use Ant Design's DollarOutlined icon */}
    </div>
    <div className="content-section">
      <Title level={3} className="amount-display">20%</Title>
      <Text className="deliveries-info">Stockout Rate</Text>
    </div>
  </Card>
          <br/>
          {/* New card for "Number of Item Stockouts by Month" */}
          <Card className="custom-card">
    <div className="icon-section">
      <DollarOutlined className="blue-icon" /> {/* Use Ant Design's DollarOutlined icon */}
    </div>
    <div className="content-section">
      <Title level={3} className="amount-display">10 days</Title>
      <Text className="deliveries-info">Supplied Lead Time</Text>
    </div>
  </Card>
        </Col>
        {/* Items Pending Delivery Card */}
        <Col span={18}>
        <Card className="centered-card" style={{ backgroundColor: '#fff' }}>
            <Text className="centered-text" style={{ color: '#00263E', fontSize: '14px', fontWeight: '500' }}>
              Number of Item Stockouts by Month
            </Text>
            <BarChart width={1350} height={300} data={barChartData}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="items" fill="orange" />
            </BarChart>
          </Card>
        </Col>
      </Row>
      <br/>
      <Col span={24}>
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
export default StockAnalysis;
