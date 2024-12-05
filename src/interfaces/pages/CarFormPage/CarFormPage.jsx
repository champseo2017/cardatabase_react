import CarService from '@application/services/CarService';
import CarApiRepository from '@infrastructure/api/CarApiRepository';
import { Button, Form, Input, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CarFormPage.css';

function CarFormPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  // สร้าง dependencies
  const carRepository = new CarApiRepository();
  const carService = new CarService(carRepository);

  useEffect(() => {
    if (id) {
      loadCar();
    }
  }, [id]);

  const loadCar = async () => {
    try {
      setLoading(true);
      const car = await carService.getCarById(id);
      form.setFieldsValue(car);
    } catch (error) {
      console.error('Error loading car:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      if (id) {
        await carService.updateCar(id, values);
      } else {
        await carService.createCar(values);
      }
      navigate('/cars');
    } catch (error) {
      console.error('Error saving car:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="car-form-page">
      <div className="container">
        <h2>{id ? 'แก้ไขข้อมูลรถ' : 'เพิ่มรถใหม่'}</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
        >
          <Form.Item
            name="brand"
            label="ยี่ห้อ"
            rules={[{ required: true, message: 'กรุณาระบุยี่ห้อรถ' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="model"
            label="รุ่น"
            rules={[{ required: true, message: 'กรุณาระบุรุ่นรถ' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="color"
            label="สี"
            rules={[{ required: true, message: 'กรุณาระบุสีรถ' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="year"
            label="ปี"
            rules={[{ required: true, message: 'กรุณาระบุปีรถ' }]}
          >
            <InputNumber
              className="w-100"
              min={1900}
              max={new Date().getFullYear() + 1}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="ราคา"
            rules={[{ required: true, message: 'กรุณาระบุราคารถ' }]}
          >
            <InputNumber
              className="w-100"
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item>
            <div className="form-actions">
              <Button onClick={() => navigate('/cars')}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {id ? 'บันทึกการแก้ไข' : 'เพิ่มรถ'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export const Component = CarFormPage;
export default CarFormPage; 