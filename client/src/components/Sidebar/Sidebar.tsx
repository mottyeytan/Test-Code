import './Sidebar.css'

interface MenuItem {
  id: string
  label: string
  icon?: string
  href: string
}

interface SidebarProps {
  activeItem?: string
  onItemClick?: (itemId: string) => void
}

const Sidebar = ({ activeItem, onItemClick }: SidebarProps) => {
  const menuItems: MenuItem[] = [
    {
      id: 'problems',
      label: 'Problems',
      icon: '📝',
      href: '#problems'
    },
    {
      id: 'submissions',
      label: 'Submissions',
      icon: '📤',
      href: '#submissions'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      href: '#profile'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      href: '#settings'
    }
  ]

  const handleItemClick = (e: React.MouseEvent, item: MenuItem) => {
    e.preventDefault()
    if (onItemClick) {
      onItemClick(item.id)
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">
          Code Test System
        </h2>
      </div>
      
      <nav className="nav-menu">
        <h3 className="menu-title">
          Menu
        </h3>
        
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.id} className="menu-item">
              <a
                href={item.href}
                className={`menu-link ${activeItem === item.id ? 'active' : ''}`}
                onClick={(e) => handleItemClick(e, item)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
