import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Sidebar = ({ isSidebarOpen, setActiveContent, activeContent }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const sidebarItems = [
    { icon: "💼", label: "Dashboard" },
    { icon: "💰", label: "Payments" },
    { icon: "👤", label: "All Buyers" },
    { icon: "👤", label: "All Users" },
    { icon: "📞", label: "All Contacts" },
    { icon: "📩", label: "All Subscribers" },
    {
      icon: "📂",
      label: "Manage Category",
      subItems: ["All Category", "Create Category", "Update Category"],
    },
    {
      icon: "📂",
      label: "Manage Sub Category",
      subItems: ["All Sub Category", "Create Sub Category", "Update Sub Category"],
    },
    {
      icon: "📝",
      label: "Manage Blogs",
      subItems: ["All Blogs", "Create Blogs"],
    },
  ];

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleItemClick = (label, index, hasSubItems) => {
    if (hasSubItems) {
      toggleDropdown(index);
    } else {
      setActiveContent(label);
      setOpenDropdown(null); // Close any open dropdown when clicking a normal menu item
    }
  };

  return (
    <div className="custon-sidebar">
      <div className={`resdes-sidebar ${isSidebarOpen ? "" : "resdes-closed"}`}>
        <div className="d-flex justify-content-around align-items-center m-2">
          <Link href="../">
            <Image src="/assets/logo.png" alt="Innodem Logo" width={100} height={50} priority />
          </Link>        </div>
          <h6 className="text-center mt-2">🧑  Welcome! Admin</h6>


        <ul>
          {sidebarItems.map((item, index) => (
            <li key={index} className={activeContent === item.label || openDropdown === index ? "active" : ""}>
              <div
                className={`sidebar-item ${openDropdown === index ? "active" : ""}`}
                onClick={() => handleItemClick(item.label, index, !!item.subItems)}
              >
                {item.icon && <span className="sidebar-icon">{item.icon}</span>}
                {item.label}
                {item.subItems && <span className="dropdown-arrow">{openDropdown === index ? "▲" : "▼"}</span>}
              </div>

              {item.subItems && openDropdown === index && (
                <ul className="dropdown">
                  {item.subItems.map((subItem, subIndex) => (
                    <li
                      key={subIndex}
                      className={activeContent === subItem ? "active" : ""}
                      onClick={() => setActiveContent(subItem)}
                    >
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
  );
};

export default Sidebar;
