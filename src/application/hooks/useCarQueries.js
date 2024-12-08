import { carApi } from '@infrastructure/api/carApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// =====================================================
// 1. นำเข้า Libraries ที่จำเป็น
// =====================================================

// =====================================================
// 2. กำหนด Keys สำหรับจัดการ Cache ของข้อมูลรถ
// =====================================================
export const carKeys = {
  all: ['cars'], // key สำหรับรายการรถทั้งหมด
  details: (id) => ['cars', id], // key สำหรับรถแต่ละคัน
  filtered: (filters) => [...carKeys.all, { filters }], // key สำหรับรถที่ผ่านการกรอง
};

// =====================================================
// 3. Custom Hook หลักสำหรับจัดการข้อมูลรถทั้งหมด
// =====================================================
export const useCarQueries = () => {
  const queryClient = useQueryClient(); // สร้าง client สำหรับจัดการ cache

  // =====================================================
  // 3.1 Hook สำหรับดึงข้อมูลรถ (Read Operations)
  // =====================================================
  
  // ดึงรายการรถทั้งหมด
  const useGetCars = (options = {}) => {
    return useQuery({
      queryKey: carKeys.all,
      queryFn: carApi.getAllCars,
      onError: (error) => {
        toast.error(`เกิดข้อผิดพลาดในการโหลดข้อมูล: ${error.message}`);
      },
      ...options,
    });
  };

  // ดึงข้อมูลรถตาม ID
  const useGetCarById = (id, options = {}) => {
    return useQuery({
      queryKey: carKeys.details(id),
      queryFn: () => carApi.getCarById(id),
      enabled: !!id, // จะทำงานเมื่อมี id เท่านั้น
      onError: (error) => {
        toast.error(`ไม่สามารถโหลดข้อมูลรถได้: ${error.message}`);
      },
      ...options,
    });
  };

  // ค้นหารถตามเงื่อนไขต่างๆ
  const useSearchCars = (filters, options = {}) => {
    return useQuery({
      queryKey: carKeys.filtered(filters),
      queryFn: () => carApi.searchCars(filters),
      enabled: !!filters, // จะทำงานเมื่อมี filters เท่านั้น
      onError: (error) => {
        toast.error(`เกิดข้อผิดพลาดในการค้นหา: ${error.message}`);
      },
      ...options,
    });
  };

  // =====================================================
  // 3.2 Hook สำหรับแก้ไขข้อมูลรถ (Write Operations)
  // =====================================================
  
  // เพิ่มรถใหม่เข้าระบบ
  const useAddCar = (options = {}) => {
    return useMutation({
      mutationFn: carApi.addCar,
      onSuccess: (newCar) => {
        queryClient.invalidateQueries({ queryKey: carKeys.all }); // อัพเดท cache รายการรถ
        toast.success('เพิ่มข้อมูลรถสำเร็จ');
        options.onSuccess?.(newCar);
      },
      onError: (error) => {
        toast.error(`ไม่สามารถเพิ่มข้อมูลรถได้: ${error.message}`);
        options.onError?.(error);
      },
    });
  };

  // อัพเดทข้อมูลรถที่มีอยู่แล้ว
  const useUpdateCar = (options = {}) => {
    return useMutation({
      mutationFn: ({ id, data }) => carApi.updateCar(id, data),
      onSuccess: (updatedCar, { id }) => {
        // อัพเดท cache ทั้งรายการรถและข้อมูลรถคันที่แก้ไข
        queryClient.invalidateQueries({ queryKey: carKeys.all });
        queryClient.invalidateQueries({ queryKey: carKeys.details(id) });
        toast.success('อัพเดทข้อมูลรถสำเร็จ');
        options.onSuccess?.(updatedCar);
      },
      onError: (error) => {
        toast.error(`ไม่สามารถอัพเดทข้อมูลรถได้: ${error.message}`);
        options.onError?.(error);
      },
    });
  };

  // ลบร้อมูลรถออกจากระบบ
  const useDeleteCar = (options = {}) => {
    return useMutation({
      mutationFn: carApi.deleteCar,
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: carKeys.all }); // อัพเดท cache รายการรถ
        queryClient.removeQueries({ queryKey: carKeys.details(id) }); // ลบข้อมูลรถที่ถูกลบออกจาก cache
        toast.success('ลบข้อมูลรถสำเร็จ');
        options.onSuccess?.();
      },
      onError: (error) => {
        toast.error(`ไม่สามารถลบข้อมูลรถได้: ${error.message}`);
        options.onError?.(error);
      },
    });
  };

  // =====================================================
  // 3.3 ฟังก์ชันจัดการ Cache เพิ่มเติม
  // =====================================================
  
  // โหลดข้อมูลรถล่วงหน้าเก็บไว้ใน cache
  const prefetchCar = async (id) => {
    await queryClient.prefetchQuery({
      queryKey: carKeys.details(id),
      queryFn: () => carApi.getCarById(id),
    });
  };

  // ดึงข้อมูลรถจี่มีอยู่แล้วใน cache
  const getCarFromCache = (id) => {
    return queryClient.getQueryData(carKeys.details(id));
  };

  // ส่งออก hooks และฟังก์ชันทั้งหมดเพื่อนำไปใช้งาน
  return {
    useGetCars,
    useGetCarById,
    useSearchCars,
    useAddCar,
    useUpdateCar,
    useDeleteCar,
    prefetchCar,
    getCarFromCache,
  };
}; 