import React from 'react';
import './index.scss';
import { Flex, Typography, Popover, Avatar } from 'antd';
import { UserOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import mrkLogoLight from '@/assets/images/mrk-light.png';
import mrkLogoDark from '@/assets/images/mrk-dark.png';
import mrkLogo from '@/assets/images/logo-mrk.png';

const { Title } = Typography;

const MrHeader = (props) => {
  const navigate = useNavigate();
  const { slotTitle, slotIcon, onIconClick, mode } = props;
  const handleIconClick = (id) => {
    const icon = slotIcon.find((icon) => icon.id === id);
    if (icon && onIconClick) {
      onIconClick(icon);
    }
  };
  return (
    <Flex justify="space-between" align="center" className="header-container">
      {/* <Title
        level={4}
        style={{ margin: 0 }}
        className="font-family-dingding gradient-text"
      >
        {props.slotTitle}
      </Title> */}
      <div
        onClick={() => navigate('/admin')}
        className="cursor-point flx-center "
        style={{ height: '60px' }}
      >
        <img src={mrkLogo} height="30" style={{ marginRight: '5px' }} />
        <img
          src={mode === 'default' ? mrkLogoLight : mrkLogoDark}
          alt="MRK"
          height="25"
        />
      </div>

      {/* 右侧 */}
      <Flex justify="space-between" align="center">
        <div style={{ height: '60px' }}>
          {slotIcon.map((item) => (
            <i
              key={item.id}
              style={{
                fontSize: '22px',
                marginRight: '15px',
                cursor: 'pointer',
              }}
              className={`iconfont mr-${item.icon} header-icon`}
              onClick={() => handleIconClick(item.id)}
            ></i>
          ))}
        </div>

        {/* <Popover
          placement="bottomRight"
          title={
            <div
              style={{
                padding: '1rem',
                borderBottom: '1px solid #e9ecef',
                fontWeight: '700',
                color: '#1b254b',
              }}
            >
              👋 你好！
            </div>
          }
          content={
            <div
              style={{ padding: '1rem', color: '#1b254b', cursor: 'pointer' }}
            >
              <div style={{ height: '30px' }}>个人中心</div>
              <div style={{ height: '30px' }}>设置</div>
              <div
                style={{ height: '30px', color: '#f93336' }}
                onClick={() => {
                  window.location.replace('/auth');
                }}
              >
                <LoginOutlined />
                退出
              </div>
            </div>
          }
          trigger="click"
        >
          <Avatar icon={<UserOutlined style={{ fontSize: '16px' }} />} />
        </Popover> */}
      </Flex>
    </Flex>
  );
};

export default MrHeader;
