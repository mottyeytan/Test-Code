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
      id: 'test',
      label: 'Test',
      icon: '⟨/⟩',
      href: '#test'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '◉',
      href: '#profile'
    },
    {
      id: 'make-test',
      label: 'Make Test',
      icon: '⬢',
      href: '#make-test'
    },
    {
      id: 'statistics',
      label: 'Statistics',
      icon: '⟐',
      href: '#statistics'
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
      {/* <div className="sidebar-header">
        <h2 className="sidebar-title">
          Code Test System
        </h2>
      </div> */}
      
      <nav className="nav-menu">
       
        
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
