import React, { useContext, useState, useEffect } from 'react';
import './index.scss';
import { Outlet, useNavigate, useLocation } from 'react-router-dom'; //渲染子路由
import { DarkModeContext } from '@/components/DarkModeProvider'; //夜间模式
import { IntlContext } from '@/components/IntlProvider'; // 国际化

// 图片
import mrkLogo from '@/assets/images/logo-mrk.png';

function Manage() {
  // 共享参数
  const { darkMode } = useContext(DarkModeContext);
  const { currentIntl } = useContext(IntlContext);

  const navigate = useNavigate(); //路由
  const location = useLocation();

  const [manageMenuUrl, setManageMenuUrl] = useState('');
  // const [manageMenuName, setManageMenuName] = useState('发现');

  const [isHidden, setIsHidden] = useState(false);

  const handleAppClick = (url, name) => {
    // 不能从当前页 进 当前页
    if (location.pathname.includes(url)) {
      return;
    }
    setManageMenuUrl(url);
    navigate(url);
    sessionStorage.setItem('manageMenuUrl', url);
    sessionStorage.setItem('manageMenuName', name);
    // setManageMenuName(name);
  };
  useEffect(() => {
    const storedManageMenuUrl = sessionStorage.getItem('manageMenuUrl');
    setManageMenuUrl(storedManageMenuUrl || 'manageMenuUrl');
  }, []);
  return (
    <div className={`manage-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* 子路由 */}
      <main className={isHidden ? 'no-padding-left' : ''}>
        <Outlet />
      </main>
    </div>
  );
}
export default Manage;
