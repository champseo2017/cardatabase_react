import App from "@/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import global styles
import "@shared/styles/global.css";
import "@shared/styles/theme.css";

// สร้าง query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // ข้อมูลจะเก่าหลังจาก 1 นาที
      cacheTime: 1000 * 60 * 5, // เก็บข้อมูลในแคชนาน 5 นาที
      refetchOnWindowFocus: false, // ไม่ต้อง refetch เมื่อกลับมาที่แท็บ
      retry: 1, // ลองใหม่ 1 ครั้งถ้าเกิดข้อผิดพลาด
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </QueryClientProvider>
);
