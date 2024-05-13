import React, { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss';
import { DarkModeContext } from '@/components/DarkModeProvider'; //夜间模式
import DarkModeToggle from '@/components/DarkModeToggle';
import WholeLoading from '@/components/whole-loading';
import { WholeLoadingContext } from '@/components/whole-loading-provider'; //全局Loading控制
import SwitchBtn from '@/components/switch-btn';
import BtnLogin from '@/components/BtnLogin';

import TypedText from '@/components/TypedText';
import FormModal from './FormModal';

// 方法
import { platformLoginAPI } from '@/request/auth';
import { setAccessToken, setRefreshToken } from '@/utils/tools';
// 图片
import mrkLight from '@/assets/images/logo-mrk.png';
import mrkDark from '@/assets/images/logo-mrk-black.png';
import loginImg from '@/assets/images/login-main-3.png';

// antd组件
import { Modal, message } from 'antd';

// 创建登录/注册上下文
export const IsRegisterContext = createContext();
export const IsForgetPwdContext = createContext(); // 创建忘记密码上下文

function Auth() {
  // 共享参数
  const { darkMode } = useContext(DarkModeContext);
  const { isLoading, setIsLoading } = useContext(WholeLoadingContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isForgetPwd, setIsForgetPwd] = useState(false); // 忘记密码

  const navigate = useNavigate();
  const locationObj = useLocation();

  // 监听地址栏 | 判断是否有第三方参数
  useEffect(() => {
    const fetchData = async () => {
      // 从地址栏里面获取参数
      const urlParams = new URLSearchParams(locationObj.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (code && state) {
        setIsLoading(true);
        try {
          const res = await platformLoginAPI({
            type: localStorage.getItem('platformType'),
            code,
            state,
          });
          if (res.code === 200) {
            const { access_token, refresh_token } = res.data;
            setAccessToken(access_token);
            setRefreshToken(refresh_token);
            navigate('/admin');
            message.success('登录成功');
          } else {
            throw new Error(res.msg || '登录失败');
          }
        } catch (error) {
          message.error(error.msg || '登录失败');

          // 如果跳转失败，清理URL参数，并替换路径
          urlParams.delete('code');
          urlParams.delete('state');
          const newUrl = `${locationObj.pathname}`;
          window.history.replaceState({}, '', newUrl);
        } finally {
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        }
      }
    };
    fetchData();
  }, [locationObj.search, locationObj.pathname]);

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  return (
    <div className={`login-container ${darkMode ? 'dark-mode' : ''}`}>
      <header
        style={{ backdropFilter: isModalVisible ? 'none' : 'blur(20px)' }}
      >
        <div className="header-content">
          <div className="mrk-logo">
            <img src={darkMode ? mrkDark : mrkLight} className="mrkLogo" />
          </div>

          <div className="btn-box">
            <DarkModeToggle size="20px" />
            <div className="space-line"></div>
            <div
              onClick={() => {
                setIsRegister(false);
                setIsForgetPwd(false);
                setIsModalVisible(true);
              }}
            >
              <BtnLogin iconName="mr-login-full" content="登录" />
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="rocket-box">
          <div className="rocket-container">
            <section>
              <div className="login-main-explain">
                <img className="logo-img" src={loginImg} alt="" />
                <div className="ai-title font-family-dingding">
                  <span>CHAT-1.0</span>
                  <i className="iconfont mr-icon_AI ai-icon"></i>
                </div>
                <div className="ai-point font-family-dingding">未来已来</div>

                <div className="ai-explain">
                  <TypedText
                    texts={['AI之旅，从现在开始，走向未来，拥抱智能新时代！']}
                  />
                </div>
                <div className="explain-btn user-select">
                  <div onClick={() => setIsModalVisible(true)}>快速体验</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* 弹框 */}
      <Modal
        title={
          isForgetPwd ? (
            '重置密码'
          ) : (
            <div className="form-switch">
              <SwitchBtn
                isRegister={isRegister}
                handRegisterChange={() => setIsRegister(!isRegister)}
              />
            </div>
          )
        }
        centered
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer=""
      >
        <IsForgetPwdContext.Provider value={{ isForgetPwd, setIsForgetPwd }}>
          <IsRegisterContext.Provider value={{ isRegister, setIsRegister }}>
            <FormModal />
          </IsRegisterContext.Provider>
        </IsForgetPwdContext.Provider>
      </Modal>
      {/* loading */}
      <WholeLoading isLoading={isLoading} />
    </div>
  );
}

export default Auth;
