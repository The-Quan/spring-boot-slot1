import React from "react";
import { NavLink } from "react-router-dom";
import { FaChalkboardTeacher, FaUserGraduate, FaUsers, FaClock, FaCalendarAlt } from "react-icons/fa";
import "./Header.css"; 

function Header() {
  return (
    <div className="header-nav">
      <div className="logo">
        <img src="https://ephoto360.com/uploads/effect-data/ephoto360.com/164dc1a84/tmin5f6419780cec5.jpg" alt="Logo" />
      </div>
      <div>
      <ul className="header-menu">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaChalkboardTeacher className="menu-icon" /> Class
          </NavLink>
        </li>
        <li>
          <NavLink to="/student" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaUserGraduate className="menu-icon" /> Student
          </NavLink>
        </li>
        <li>
          <NavLink to="/studentclass" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaUsers className="menu-icon" /> Student Class
          </NavLink>
        </li>
        <li>
          <NavLink to="/classschedule" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaClock className="menu-icon" /> Class Schedule
          </NavLink>
        </li>
        {/* <li>
          <NavLink to="/schedule" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaCalendarAlt className="menu-icon" /> Schedule
          </NavLink>
        </li> */}
      </ul>
      </div>
    </div>
  );
}

export default Header;
