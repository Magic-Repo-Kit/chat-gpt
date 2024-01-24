import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '@/utils/tools';
import { message } from 'antd';
import ajax from '@/request';



function sseRequest(url, params, onMessage, onError) {
  let eventSource = null;
  const ctrl = new AbortController();
  let headers = {
    "Content-Type": "application/json",
    'Accept': '*/*',
    'User-Type': "pc",
    Authorization: `Bearer ${getAccessToken()}`
  }
  const startSse = () => {
    eventSource = fetchEventSource(`/api${url}`, {
      method: "POST",
      signal: ctrl.signal,
      headers,
      body: JSON.stringify(params),
      openWhenHidden: true, //解决:当发送请求且暂未触发 onopen 事件前，离开当前窗口时会自动被取消
      async onopen(response) {
        if (response.ok && response.status === 200) {
          console.log('连接成功')
        } else {
          console.log('连接异常')
          message.error(response.error || '连接异常');
          const originalRequest = response.config;
          // 如果token过期，获取新token重新请求
          if (response.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const refreshToken = getRefreshToken();
              const res = await ajax.post(`/system/auth/refresh-token?refreshToken=${refreshToken}`);
              if (res.data.code === 200) {
                const newAccessToken = response.data.data.access_token;
                const newRefreshToken = response.data.data.refresh_token;
                // 更新本地存储token
                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                // 关闭连接 重新请求
                eventSource.onclose();
                headers.Authorization = `Bearer ${newAccessToken}`;
                startSse();
              }

            } catch (error) {
              console.log("🚀 ~ file: sseRequest.js:41 ~ onopen ~ error:", error)
            }
          }
        }
      },
      async onmessage(event) {
        const data = JSON.parse(event.data);
        if (onMessage) {
          onMessage(data);
        }

        // 表示整体结束
        // if (event.data === '[DONE]') {
        //   console.log('结束')
        //   return
        // }
        // if (event.data) {
        //   const data = JSON.parse(event.data)
        //   answerContent += data.content
        // }
      },

      async onerror(error) {
        message.error(error || '连接错误');
        if (onError) {
          onError(error);
        }
        throw error;
      },
      async onclose() {
        console.log('关闭连接');
      },
    });
  }
  startSse();
  return eventSource;
}

export default sseRequest;


// // 连接一旦建立，就会触发open事件，可以在onopen属性定义回调函数
// // 客户端收到服务器发来的数据，就会触发message事件，可以在onmessage属性的回调函数。
// // 如果发生通信错误（比如连接中断），就会触发error事件，可以在onerror属性定义回调函数。
// // close方法用于关闭 SSE 连接。
