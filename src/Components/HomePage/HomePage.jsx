import React from 'react';
import MenuTile from '../MenuTile/MenuTile';

import './HomePage.css';

export default function HomePage() {
  return (
    <div className='home-page'>
      <MenuTile className="grid-item" />
      <MenuTile className="grid-item" />
      <MenuTile className="grid-item" />
      <MenuTile className="grid-item" />
      <MenuTile className="grid-item" />
      <MenuTile className="grid-item" />
    </div>
  )
}
