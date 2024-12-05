import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CarService from '@application/services/CarService';
import CarApiRepository from '@infrastructure/api/CarApiRepository';
import { Button, Popconfirm, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CarList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // สร้าง dependencies
  const carRepository = new CarApiRepository();
  const carService = new CarService(carRepository);

  const columns = [
    {
      title: 'ยี่ห้อ',
      dataIndex: 'brand',
      key: 'brand',
      sorter: (a, b) => a.brand.localeCompare(b.brand),
    },
    {
      title: 'รุ่น',
      dataIndex: 'model',
      key: 'model',
      sorter: (a, b) => a.model.localeCompare(b.model),
    },
    {
      title: 'ปี',
      dataIndex: 'year',
      key: 'year',
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: 'สี',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'ราคา',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'จัดการ',
      key: 'action',
      render: (_, record) => {
        // ดึง ID จาก URL ใน _links
        const id = record._links?.self?.href?.split('/').pop();
        
        return (
          <Space size="middle">
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(id)}
              disabled={!id}
            >
              แก้ไข
            </Button>
            <Popconfirm
              title="ต้องการลบข้อมูลนี้?"
              onConfirm={() => handleDelete(id)}
              okText="ใช่"
              cancelText="ไม่"
              disabled={!id}
            >
              <Button 
                type="primary" 
                danger 
                icon={<DeleteOutlined />}
                disabled={!id}
              >
                ลบ
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const fetchCars = async () => {
    setLoading(true);
    try {
      const carsData = await carService.getAllCars();
      setCars(carsData.map(car => ({
        ...car,
        key: car._links?.self?.href || car.id,
      })));
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await carService.deleteCar(id);
      fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const handleEdit = (id) => {
    if (!id) return;
    navigate(`/cars/${id}/edit`);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="carlist-container">
      <div className="table-header">
        <h2>รายการรถ</h2>
        <Button 
          type="primary" 
          onClick={() => navigate('/cars/add')}
        >
          เพิ่มรถใหม่
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={cars}
        loading={loading}
        pagination={{
          total: cars.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </div>
  );
}

export default CarList; 