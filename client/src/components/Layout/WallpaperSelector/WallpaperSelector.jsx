import React, { useState } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import './wallpaper-selector.css';

const WallpaperSelector = ({ wallpapers, onSelect, currentWallpaper }) => {
  // Explicit state to control the menu visibility
  const [show, setShow] = useState(false);

  const handleSelect = (url) => {
    const selectedObj = wallpapers.find((w) => w.url === url);
    if (selectedObj && onSelect) {
      onSelect(selectedObj);
    }
    // FORCE the menu to close immediately after state update
    setShow(false);
  };

  return (
    <div className="wallpaper-selector">
      <label className="selector-label mb-2">Choose Your Background:</label>

      <DropdownButton
        id="wallpaper-dropdown-button"
        title={currentWallpaper ? currentWallpaper.name : '-- Select a Wallpaper --'}
        show={show}
        onToggle={(isOpen) => setShow(isOpen)}
        onSelect={handleSelect}
        variant="outline-success"
        className="w-100"
      >
        {wallpapers.map((wallpaper) => (
          <Dropdown.Item
            key={wallpaper.id}
            eventKey={wallpaper.url}
            active={currentWallpaper?.url === wallpaper.url}
          >
            {wallpaper.name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
};

export default WallpaperSelector;
