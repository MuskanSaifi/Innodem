import React, { useState } from "react";

const Sidebar = ({ isSidebarOpen, setActiveContent, activeContent }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const sidebarItems = [
    { icon: "💼", label: "Dashboard" },
    { icon: "💰", label: "Payments" },
    { icon: "👤", label: "All Users" },
    {
      icon: "📎",
      label: "All Category",
      subItems: ["All Category","Create Category", "Update Category"],
    },
    {
      icon: "➕",
      label: "Create Sub Category",
      subItems: ["All Sub Category", "Create Sub Category", "Update Sub Category"],
    },
    {
      icon: "➕",
      label: "All Products",
    },
 
  ];

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <>
    <div className="custon-sidebar">
    <div className={`resdes-sidebar ${isSidebarOpen ? "" : "resdes-closed"}`}>
      <h2>Innodem Dashboard</h2>
      <ul>
        {sidebarItems.map((item, index) => (
          <li
          key={index}
            className={activeContent === item.label ? "active" : ""}
          >
            <div
              className="sidebar-item"
              onClick={() =>
                item.subItems ? toggleDropdown(index) : setActiveContent(item.label)
              }
              >
              {item.icon && <span className="sidebar-icon">{item.icon}</span>}
              {item.label}
              {item.subItems && <span className="dropdown-arrow">▼</span>}
            </div>
            {item.subItems && openDropdown === index && (
              <ul className="dropdown">
                {item.subItems.map((subItem, subIndex) => (
                  <li key={subIndex} onClick={() => setActiveContent(subItem)}>
                    {subItem}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
    </div>
        </>
  );
};

export default Sidebar;
