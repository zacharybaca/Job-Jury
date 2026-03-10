import React from 'react';
import './wallpaper-selector.css';

const WallpaperSelector = ({ wallpapers, onSelect, currentWallpaper }) => {
  return (
    <div className="wallpaper-selector">
      <h2 className="selector-title">Choose Your Wallpaper</h2>
      <div className="wallpaper-grid">
        {wallpapers && wallpapers.length > 0 ? (
          wallpapers.map((wallpaper, index) => {
            // Check if this specific wallpaper is the active one
            const isActive = currentWallpaper?.url === wallpaper.url;

            return (
              <div
                key={wallpaper.id || index}
                className={`wallpaper-option ${isActive ? 'active' : ''}`}
                onClick={() => onSelect(wallpaper)}
              >
                <img
                  src={wallpaper.url}
                  alt={`Wallpaper ${index + 1}`}
                  className="wallpaper-image"
                />
                {isActive && (
                  <div className="active-badge">
                    <span className="check-icon">✓</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="no-wallpapers">No wallpapers available.</p>
        )}
      </div>
    </div>
  );
};

export default WallpaperSelector;
