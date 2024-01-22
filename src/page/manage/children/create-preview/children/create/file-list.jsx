import React, { useState } from 'react';
import '../../index.scss';
import { useNavigate } from 'react-router-dom';

// 图片
import knowledgeFile from '@/assets/images/file.png';
import knowledgeIcon from '@/assets/images/knowledge-icon.png';

// antd组件
import { Button, Dropdown, Popconfirm } from 'antd';

// item内容
function FileItem({ file, onEdit, onMove, onDelete }) {
  const [dropdownEditOpen, setDropdownEditOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    // type 1-文件 2-知识库
    if (file.type === 1) {
      // 在当前URL基础上添加或替换parentId参数
      navigate(`?parentId=${file.id || ''}`);
    } else {
      const newPath = window.location.pathname.replace(/\/[^/]*$/, '/detail');
      navigate(`${newPath}?parentId=${file.id || ''}`);
    }
  };
  return (
    <div
      key={file.id}
      className="knowledge-content-item user-select"
      onClick={handleClick}
    >
      <div className="knowledge-item-header">
        <div className="flx-center">
          <img
            src={file.type === 1 ? knowledgeFile : file.image || knowledgeIcon}
          />
          <span className="single-omit">{file.name}</span>
        </div>
        <div
          className="knowledge-item-header-edit"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Dropdown
            dropdownRender={() => (
              <div className="knowledge-list-dropdown-box">
                <div>
                  <Button
                    icon={
                      <>
                        <i className="iconfont mr-change-1"></i>
                      </>
                    }
                    type="text"
                    className="title-dropdown-btn"
                    onClick={() => {
                      setDropdownEditOpen(false);
                      onEdit(file);
                    }}
                  >
                    编 辑
                  </Button>
                </div>
                <div>
                  <Button
                    icon={
                      <>
                        <i className="iconfont mr-yidongxuanze"></i>
                      </>
                    }
                    type="text"
                    className="title-dropdown-btn"
                    onClick={() => {
                      setDropdownEditOpen(false);
                      onMove(file);
                    }}
                  >
                    移 动
                  </Button>
                </div>
                <div>
                  <Button
                    icon={
                      <>
                        <i className="iconfont mr-daochu"></i>
                      </>
                    }
                    type="text"
                    className="title-dropdown-btn"
                    onClick={() => {
                      setDropdownEditOpen(false);
                      // onDelete(file);
                    }}
                  >
                    导 出
                  </Button>
                </div>
                <div>
                  <Popconfirm
                    title="提示"
                    description="确认删除?"
                    okText="确认"
                    cancelText="取消"
                    placement="right"
                    onConfirm={() => {
                      setDropdownEditOpen(false);
                      onDelete(file);
                    }}
                    onCancel={() => setDropdownEditOpen(false)}
                    icon={
                      <i
                        className="iconfont mr-group43"
                        style={{
                          color: '#fb6547',
                          position: 'relative',
                          top: '-2px',
                          left: '-3px',
                          marginRight: '2px',
                        }}
                      ></i>
                    }
                  >
                    <Button
                      icon={
                        <>
                          <i className="iconfont mr-del-1"></i>
                        </>
                      }
                      type="text"
                      className="title-dropdown-btn"
                    >
                      删 除
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            )}
            placement="bottomRight"
            trigger={['click']}
            open={dropdownEditOpen}
            onOpenChange={(dropdownEditOpen) =>
              setDropdownEditOpen(dropdownEditOpen)
            }
          >
            <i className="iconfont mr-more-2"></i>
          </Dropdown>
        </div>
      </div>
      <div className="knowledge-item-content single-omit">
        {file.description ||
          `这个${file.type === 1 ? '文件夹' : '知识库'}还没有介绍~`}
      </div>
      <div className="knowledge-item-footer">
        <div></div>
        <div className="flx-center">
          <span>{file.type === 1 ? '文件夹' : '知识库'}</span>
        </div>
      </div>
    </div>
  );
}

export default FileItem;
