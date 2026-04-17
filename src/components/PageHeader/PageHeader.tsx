import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  breadcrumbs: { title: string; href?: string }[];
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs, children }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <Breadcrumb style={{ marginBottom: '8px' }}>
        {breadcrumbs.map((item, index) => (
          <Breadcrumb.Item key={index}>
            {item.href ? <Link to={item.href}>{item.title}</Link> : item.title}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>{title}</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
