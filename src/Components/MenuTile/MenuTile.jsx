import React from 'react';
import './MenuTile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const MenuTile = () => {
  return (
    <div className="menu-tile">
      <div className="icon-container">
        <FontAwesomeIcon icon={faCalendarAlt} className="menu-icon" />
      </div>
      <p>Appointments</p>
    </div>
  );
}

export default MenuTile;
