import { useCarQueries } from '@application/hooks/useCarQueries';
import { Button, Form, Input, InputNumber } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import './CarFormPage.css';

function CarFormPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    useGetCarById,
    useAddCar,
    useUpdateCar,
  } = useCarQueries();

  // ดึงข้อมูลรถกรณีแก้ไข
  const {
    data: car,
    isLoading: isLoadingCar,
    error: carError,
  } = useGetCarById(id, {
    enabled: !!id,
    onSuccess: (data) => {
      form.setFieldsValue(data);
    },
  });

  // mutation สำหรับเพิ่ม/แก้ไขข้อมูล
  const addCarMutation = useAddCar({
    onSuccess: () => {
      navigate('/cars');
    },
  });

  const updateCarMutation = useUpdateCar({
    onSuccess: () => {
      navigate('/cars');
    },
  });

  const onFinish = async (values) => {
    try {
      if (id) {
        await updateCarMutation.mutateAsync({ id, data: values });
      } else {
        await addCarMutation.mutateAsync(values);
      }
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  if (id && carError) {
    return <div>เกิดข้อ��ิดพลาด: {carError.message}</div>;
  }

  const isLoading = isLoadingCar || addCarMutation.isPending || updateCarMutation.isPending;

  return (
    <div className="car-form-page">
      <div className="container">
        <h2>{id ? 'แก้ไขข้อมูลรถ' : 'เพิ่มรถใหม่'}</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={isLoading}
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
            rules={[{ required: true, message: 'กรุณาร��บุปีรถ' }]}
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
              <Button type="primary" htmlType="submit" loading={isLoading}>
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