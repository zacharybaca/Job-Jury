import React from 'react';
import './wallpaper-selector.css';

const WallpaperSelector = ({ wallpapers, onSelect, currentWallpaper }) => {
  // 1. Helper function to handle the dropdown selection
  const handleDropdownChange = (e) => {
    const selectedUrl = e.target.value;
    if (!selectedUrl) return;

    // Find the full wallpaper object based on the URL selected
    const selectedObj = wallpapers.find((w) => w.url === selectedUrl);
    if (selectedObj) {
      onSelect(selectedObj);
    }
  };

  return (
    <div className="wallpaper-selector">
      {/* 2. Fixed 'htmFor' to React's 'htmlFor' */}
      <label htmlFor="wallpaper-selector" className="selector-label">
        Choose Your Background:
      </label>

      <div className="wallpaper-grid">
        {/* 3. The Controlled Dropdown */}
        <select
          name="wallpaper"
          id="wallpaper-selector"
          className="wallpaper-dropdown"
          value={currentWallpaper?.url || ''} // Keeps dropdown in sync with state
          onChange={handleDropdownChange}
        >
          <option value="" disabled>
            -- Select a Wallpaper --
          </option>
          {wallpapers.map((wallpaper) => (
            <option key={`opt-${wallpaper.id}`} value={wallpaper.url}>
              {wallpaper.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default WallpaperSelector;
