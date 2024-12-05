import MainLayout from '@interfaces/layouts/MainLayout/MainLayout';
import CarListPage from '@interfaces/pages/CarListPage/CarListPage';
import ErrorPage from '@interfaces/pages/ErrorPage/ErrorPage';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <CarListPage />,
      },
      {
        path: 'cars',
        children: [
          {
            index: true,
            element: <CarListPage />,
          },
          {
            path: 'add',
            async lazy() {
              const { Component } = await import('@interfaces/pages/CarFormPage/CarFormPage');
              return { Component };
            },
          },
          {
            path: ':id/edit',
            async lazy() {
              const { Component } = await import('@interfaces/pages/CarFormPage/CarFormPage');
              return { Component };
            },
          }
        ]
      }
    ]
  }
]); 