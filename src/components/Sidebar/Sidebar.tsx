import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartPie, 
  faGear,
  faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed: _collapsed, onToggle: _onToggle }) => {
  const menuItems = [
    { icon: faChartPie, path: '/' },
  ];

  return (
    <aside className="app-sidebar-slim">
      <div className="sidebar-top">
        <div className="sidebar-logo">
           <div className="logo-icon" style={{ background: '#D83A41', width: '100%', height: '100%', borderRadius: '4px' }}></div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={item.icon} />
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item">
          <FontAwesomeIcon icon={faGear} />
        </button>
        <button className="nav-item">
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
