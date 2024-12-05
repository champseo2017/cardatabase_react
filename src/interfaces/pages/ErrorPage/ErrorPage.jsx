import { Button, Result } from 'antd';
import { useNavigate, useRouteError } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <Result
      status="error"
      title="เกิดข้อผิดพลาด"
      subTitle={error?.message || 'ไม่พบหน้าที่คุณต้องการ'}
      extra={[
        <Button 
          type="primary" 
          key="home"
          onClick={() => navigate('/')}
        >
          กลับหน้าหลัก
        </Button>
      ]}
    />
  );
}

export default ErrorPage; 