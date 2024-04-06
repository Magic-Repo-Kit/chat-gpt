import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd'; //加载中
// 避免闪屏
const lazyLoad = (component) => {
  return (
    <Suspense
      fallback={
        <Spin
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      }
    >
      {component}
    </Suspense>
  );
};

// 结构路由(懒加载)
// import AdminLayout from '@/layouts/admin';
const AdminLayout = lazy(() => import('@/layouts/admin'));
const AuthLayout = lazy(() => import('@/layouts/auth'));
const FailLayout = lazy(() => import('@/layouts/fail'));

const Manage = lazy(() => import('@/page/manage'));

// 对话
const Chat = lazy(() => import('@/page/manage/children/chat'));

// 路由
const routes = [
  // 通过权限页面
  {
    path: 'admin',
    element: <AdminLayout />,
    children: [
      // 空路径 匹配 "/admin" 重定向到 "/admin/manage"
      {
        path: '',
        element: <Navigate to="manage" replace />,
      },
      // 工作台
      {
        path: 'manage',
        element: lazyLoad(<Manage />),
        children: [
          //默认路由
          {
            path: '',
            element: (
              <Navigate
                to={sessionStorage.getItem('manageMenuUrl') || 'chat'}
                replace
              />
            ),
          },
          // 聊天
          {
            path: 'chat',
            element: lazyLoad(<Chat />),
          },
        ],
      },
    ],
  },
  // 鉴权
  {
    path: 'auth',
    element: <AuthLayout />,
  },
  // 找不到上面的，则匹配404
  {
    path: '*',
    element: <FailLayout />,
  },
];

export default routes;
