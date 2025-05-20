import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Sidebar = ({ isSidebarOpen, setActiveContent, activeContent }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const sidebarItems = [
    { icon: "/assets/dashboardicons/Dashboard.png", label: "Dashboard" },
    { icon: "/assets/dashboardicons/Payments.png", label: "Payments" },
    { icon: "/assets/dashboardicons/All Buyers.png", label: "All Buyers" },
    { icon: "/assets/dashboardicons/All sellers.png", label: "All Seller" },
    { icon: "/assets/dashboardicons/Leads-Enquiry.png", label: "Leads & Enquiry" },
    { icon: "/assets/dashboardicons/All Contacts.png", label: "All Contacts" },
    { icon: "/assets/dashboardicons/All Subscribers.png", label: "All Subscribers" },
    { icon: "/assets/dashboardicons/Manage Support Members.png", label: "Manage Support Members" },
    { icon: "/assets/dashboardicons/add recording.png", label: "All Recordings" },
    { icon: "/assets/dashboardicons/clientswebsiteleads.png", label: "All Clients Website Leads" },
    {
      icon: "/assets/dashboardicons/manage Category.png",
      label: "Manage Category",
      subItems: ["All Category", "Create Category", "Update Category"],
    },
    {
      icon: "/assets/dashboardicons/Manage Sub Category.png",
      label: "Manage Sub Category",
      subItems: ["All Sub Category", "Create Sub Category", "Update Sub Category"],
    },
    {
      icon: "/assets/dashboardicons/Manage Blogs.png",
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
      <div className="d-flex justify-content-around flex-column align-items-center p-2  sticky top-0 bg-white">
    <Link href="../">
      <Image src="/assets/logo123.png" alt="Innodem Logo" width={100} height={50} priority />
    </Link>
    <h6 className="text-center mt-2">🧑 Welcome! Admin</h6>
  </div>

<ul>
{sidebarItems.map((item, index) => (
<li key={index} className={activeContent === item.label || openDropdown === index ? "active" : ""}>
<div
className={`sidebar-item ${openDropdown === index ? "active" : ""}`}
onClick={() => handleItemClick(item.label, index, !!item.subItems)}
>
<span className="sidebar-icon">
  {item.icon.startsWith("/") ? (
    <Image src={item.icon} alt={item.label} width={40} height={40} />
  ) : (
    item.icon
  )}
</span>

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
