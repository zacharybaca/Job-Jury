import React from 'react';
import './wallpaper-selector.css';

const WallpaperSelector = ({ wallpapers, onSelect, currentWallpaper }) => {
  return (
    <div className="wallpaper-selector">
      <h3 className="selector-title">The Breakroom Wallpaper</h3>
      <div className="wallpaper-grid">
        {wallpapers.map((wallpaper) => {
          const isActive = currentWallpaper?.url === wallpaper.url;
          return (
            <div
              key={wallpaper.id}
              className={`wallpaper-option ${isActive ? 'active' : ''}`}
              onClick={() => onSelect(wallpaper)}
            >
              <img src={wallpaper.url} alt={wallpaper.name} className="wallpaper-image" />
              {isActive && <div className="active-check">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WallpaperSelector;
