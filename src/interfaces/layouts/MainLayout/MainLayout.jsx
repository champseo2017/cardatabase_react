import { CarOutlined, PlusOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './MainLayout.css';

const { Header, Content } = Layout;

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/cars',
      icon: <CarOutlined />,
      label: 'รายการรถ',
    },
    {
      key: '/cars/add',
      icon: <PlusOutlined />,
      label: 'เพิ่มรถ',
    }
  ];

  return (
    <Layout className="main-layout">
      <Header>
        <div className="header-content">
          <span 
            className="header-title" 
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            Carshop
          </span>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ flex: 1, minWidth: 0 }}
          />
        </div>
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default MainLayout; 