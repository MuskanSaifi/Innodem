// app/buyerdashboard/sidebar.js
import React, { useEffect, useState } from "react";
import Image from "next/image";

const Sidebar = ({ isSidebarOpen, setActiveContent, activeContent }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [buyerdata, setBuyerdata] = useState("");


  const sidebarItems = [
    {
      icon: "/assets/dashboardicons/profile-1.png",
      label: "Profile",
      subItems: ["Buyer Profile"],
    },
     ];

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("buyer");  
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setBuyerdata(parsedUser);
      } catch (error) {
        console.error("Error parsing buyer data:", error);
      }
    }
  }, []);

  return (
    <>
      <div className="custon-sidebar">
        <div className={`resdes-sidebar ${isSidebarOpen ? "" : "resdes-closed"}`}>
          <h6 className="text-center mt-2">🧑  Welcome! {buyerdata?.fullname || "Guest"}</h6>
          <ul>
            {sidebarItems.map((item, index) => (
              <li key={index} className={activeContent === item.label ? "active" : ""}>
                <div
                  className="sidebar-item"
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      item.subItems ? toggleDropdown(index) : setActiveContent(item.label);
                    }
                  }}
                >
                  {item.icon && <span className="sidebar-icon">
                      {item.icon.startsWith("/") ? (
                        <Image src={item.icon} alt={item.label} width={44} height={44} />
                      ) : (
                        item.icon
                      )}
                  </span>}
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
