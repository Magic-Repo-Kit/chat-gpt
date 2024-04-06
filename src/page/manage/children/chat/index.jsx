import React, { useContext, useState, useEffect } from 'react';
import './index.scss';

import { DarkModeContext } from '@/components/DarkModeProvider'; //夜间模式

import ChatCtx from './children/chat-ctx';
import ChatList from './children/chat-list';
import ajax from '@/request';

// 图片
import botHead from '@/assets/images/bot-head.png';
import mrkLight from '@/assets/images/logo-mrk.png';
import mrkDark from '@/assets/images/logo-mrk-black.png';

import { Drawer, Popover } from 'antd';

function Chat() {
  // 共享参数
  const { darkMode } = useContext(DarkModeContext);
  const [conversationId, setConversationId] = useState(''); //当前选中的id
  const [messages, setMessages] = useState([]); // 聊天消息

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [roleList, setRoleList] = useState([]); // 角色列表
  const [selectRole, setSelectRole] = useState(''); //选中的角色id

  const [roleParams, setRoleParams] = useState({
    // 角色列表参数
    pageNo: 1,
    pageSize: 100,
    keywords: '',
  });
  const [listParams, setListParams] = useState({
    pageNo: 1,
    pageSize: 100,
  });

  // 获取对话详情
  const getChatMessages = async () => {
    try {
      const res = await ajax.get(
        `/chat/gpt/list-conversation-detail?conversationId=${conversationId}`
      );
      if (res.code === 200) {
        if (res.data) {
          setMessages(res.data);
        }
      }
    } catch (error) {
      console.log('🚀 ~ getFileList ~ error:', error || '获取对话详情失败');
    }
  };

  // 开启抽屉
  const onShowDrawer = () => {
    setDrawerOpen(true);
  };
  // 关闭抽屉
  const onCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // 获取角色列表
  const getRoleList = async () => {
    try {
      const res = await ajax.get(`/chat/role/list-page`, roleParams);
      if (res.code === 200) {
        if (res.data) {
          setRoleList(res.data.list || []);
          if (res.data.list.length > 0) {
            setSelectRole(res.data.list[0].id); // 设置选中的角色为第一个角色的id
          }
        }
      }
    } catch (error) {
      console.log('🚀 ~ getFileList ~ error:', error || '获取模型列表失败');
    }
  };
  // 选择角色
  const handleRoleClick = (roleId) => {
    setSelectRole(roleId);
  };
  // 获取会话列表list
  const getTitleList = async () => {
    try {
      const res = await ajax.get(`/chat/gpt/page-conversation`, listParams);
      if (res.code === 200) {
        if (res.data) {
          // 默认设置第一个会话为激活状态
          if (!conversationId) {
            setConversationId(res.data.list[0]?.conversationId);
          }
        }
      }
    } catch (error) {
      console.log('🚀 ~ getFileList ~ error:', error || '获取会话列表失败');
    }
  };
  useEffect(() => {
    getChatMessages();
  }, [conversationId]);

  useEffect(() => {
    getRoleList();
    getTitleList();
  }, []);

  return (
    <div className={`chat-container-box ${darkMode ? 'dark-mode' : ''}`}>
      {/* 头部 */}
      <header>
        <div className="mrk-logo" onClick={onShowDrawer}>
          <img src={darkMode ? mrkDark : mrkLight} className="mrkLogo" />
        </div>
      </header>
      <ChatCtx
        messages={messages}
        setMessages={setMessages}
        conversationId={conversationId}
      />
      {/* 抽屉 */}
      <Drawer
        title="聊天记录"
        onClose={onCloseDrawer}
        open={drawerOpen}
        placement="left"
      >
        <div className="chat-drawer-box">
          <ChatList
            conversationId={conversationId}
            setConversationId={setConversationId}
            onCloseDrawer={onCloseDrawer}
          />
        </div>
      </Drawer>
    </div>
  );
}

export default Chat;
