import React from "react";
import "./MobileMenuButton.css";

const MobileMenuButton = ({ toggleSidebar }) => {
    return (
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
            ☰
        </button>
    );
};

export default MobileMenuButton;
