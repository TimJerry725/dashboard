import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Input, Badge, Avatar } from 'antd';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed }) => {
  return (
    <header className="app-header">
      <div style={{ flex: 1 }}>
        <Input 
          prefix={<FontAwesomeIcon icon={faSearch} style={{ color: '#999' }} />}
          placeholder="Search projects..."
          style={{ width: '300px', borderRadius: '8px' }}
        />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Badge count={5} size="small" offset={[-2, 2]}>
          <FontAwesomeIcon icon={faBell} style={{ fontSize: '20px', color: '#666', cursor: 'pointer' }} />
        </Badge>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{ textAlign: 'right', lineHeight: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Timothy J.</div>
            <div style={{ fontSize: '12px', color: '#999' }}>Administrator</div>
          </div>
          <Avatar icon={<FontAwesomeIcon icon={faUserCircle} />} style={{ backgroundColor: '#f0f0f0', color: '#666' }} />
        </div>
      </div>
    </header>
  );
};

export default Header;
