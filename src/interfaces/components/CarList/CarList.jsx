import { useCarQueries } from '@/application/hooks/useCarQueries';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CarList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    brand: '',
    model: '',
    year: '',
  });

  const { useGetCars, useDeleteCar } = useCarQueries();
  
  // ใช้ query hook เพื่อดึงข้อมูลรถ
  const { data: cars = [], isLoading, error } = useGetCars();
  
  // ใช้ mutation hook สำหรับลบรถ
  const deleteMutation = useDeleteCar();

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const handleEdit = (id) => {
    if (!id) return;
    navigate(`/cars/${id}/edit`);
  };

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
      title: 'ระเบียน',
      dataIndex: 'registerNumber',
      key: 'registerNumber',
    },
    {
      title: 'ราคา',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => price?.toLocaleString('th-TH', { style: 'currency', currency: 'THB' }),
    },
    {
      title: 'เจ้าของ',
      dataIndex: 'owners',
      key: 'owners',
      render: (owners) => (
        <Space size={[0, 4]} wrap>
          {owners?.map((owner) => (
            <Tag key={owner.ownerid} color="blue">
              {owner.firstname} {owner.lastname}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'จัดการ',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            disabled={!record.id}
          >
            แก้ไข
          </Button>
          <Popconfirm
            title="ต้องการลบข้อมูลนี้?"
            onConfirm={() => handleDelete(record.id)}
            okText="ใช่"
            cancelText="ไม่"
            disabled={!record.id || deleteMutation.isPending}
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />}
              disabled={!record.id || deleteMutation.isPending}
              loading={deleteMutation.isPending}
            >
              ลบ
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) {
    return <div>เกิดข้อผิดพลาด: {error.message}</div>;
  }

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
        dataSource={cars.map(car => ({
          ...car,
          key: car.id,
        }))}
        loading={isLoading || deleteMutation.isPending}
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