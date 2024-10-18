// import Guide from '@/components/Guide';
// import { trim } from '@/utils/format';
// import { PageContainer } from '@ant-design/pro-components';
// import { useModel } from '@umijs/max';
// import styles from './index.less';

// const HomePage: React.FC = () => {
//   const { name } = useModel('global');
//   return (
//     <PageContainer ghost>
//       <div className={styles.container}>
//         {/* <Guide name={trim(name)} /> */}
//       </div>
//     </PageContainer>
//   );
// };

// export default HomePage;
// import { PageContainer } from '@ant-design/pro-components';
// import { Input, Dropdown, Menu, Button, Avatar, Row, Col } from 'antd';
// import { DownOutlined, UserOutlined } from '@ant-design/icons';
// import styles from './index.less';

// const HomePage: React.FC = () => {
//   const menu = (
//     <Menu>
//       <Menu.Item key="1">Files</Menu.Item>
//       <Menu.Item key="2">Authors</Menu.Item>
//       <Menu.Item key="3">My Files</Menu.Item>
//     </Menu>
//   );

//   return (
//     <PageContainer ghost>
//       <div className={styles.container}>
//         <Row justify="space-between" align="middle">
//           {/* Search bar */}
//           <Col>
//             <Input.Search placeholder="Search..." style={{ width: 200 }} />
//           </Col>

//           {/* Dropdowns and Button */}
//           <Col>
//             <Row align="middle" gutter={16}>
//               <Col>
//                 <Dropdown overlay={menu}>
//                   <Button>
//                     Files <DownOutlined />
//                   </Button>
//                 </Dropdown>
//               </Col>

//               <Col>
//                 <Dropdown overlay={menu}>
//                   <Button>
//                     Authors <DownOutlined />
//                   </Button>
//                 </Dropdown>
//               </Col>

//               <Col>
//                 <Dropdown overlay={menu}>
//                   <Button>
//                     My Files <DownOutlined />
//                   </Button>
//                 </Dropdown>
//               </Col>

//               <Col>
//                 <Button type="primary">Create New</Button>
//               </Col>

//               <Col>
//                 <Avatar size="large" icon={<UserOutlined />} />
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//       </div>
//     </PageContainer>
//   );
// };

// export default HomePage;
