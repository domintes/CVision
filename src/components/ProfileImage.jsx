import { useAtom } from 'jotai';
import { FaTimes } from 'react-icons/fa';
import { 
  profileImageAtom, 
  profileBorderAtom, 
  profileBorderColorAtom, 
  profileImageScaleAtom 
} from '../store/atoms';

const ProfileImage = () => {
  const [profileImage, setProfileImage] = useAtom(profileImageAtom);
  const [profileBorder, setProfileBorder] = useAtom(profileBorderAtom);
  const [borderColor, setBorderColor] = useAtom(profileBorderColorAtom);
  const [imageScale, setImageScale] = useAtom(profileImageScaleAtom);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        document.body.setAttribute('tabindex', '-1');
        document.body.focus();
        document.body.removeAttribute('tabindex');
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const handleBorderChange = (e) => {
    setProfileBorder(Number(e.target.value));
  };

  const handleBorderColorChange = (e) => {
    setBorderColor(e.target.value);
  };

  const handleImageScaleChange = (e) => {
    setImageScale(e.target.value);
  };

  return (
    <div className="profile-image-section">
      <div 
        className="profile-image-container"
        style={{ border: `${profileBorder}px solid ${borderColor}` }}
      >
        {profileImage ? (
          <div className="image-wrapper">
            <img 
              src={profileImage} 
              alt="Profile" 
              className="profile-preview" 
              style={{ objectFit: imageScale }}
            />
            <button 
              onClick={handleRemoveImage}
              className="remove-image-button"
              title="Usuń zdjęcie"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <div className="image-placeholder">
            <span>Kliknij aby dodać zdjęcie</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="image-input"
          id="profile-image-input"
        />
        <label htmlFor="profile-image-input" className="image-upload-label">
          {profileImage ? 'Zmień zdjęcie' : ''}
        </label>
      </div>
      <div className="controls-container">
        <div className="border-controls">
          <div className="border-selector">
            <label htmlFor="border-thickness">Grubość ramki:</label>
            <select 
              id="border-thickness"
              value={profileBorder}
              onChange={handleBorderChange}
            >
              <option value="0">Brak</option>
              <option value="2">2px</option>
              <option value="4">4px</option>
              <option value="5">5px</option>
            </select>
          </div>
          <div className="border-color-picker">
            <label htmlFor="border-color">Kolor ramki:</label>
            <input
              type="color"
              id="border-color"
              value={borderColor}
              onChange={handleBorderColorChange}
            />
          </div>
        </div>
        <div className="image-scale-selector">
          <label htmlFor="image-scale">Skalowanie zdjęcia:</label>
          <select
            id="image-scale"
            value={imageScale}
            onChange={handleImageScaleChange}
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Fill</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProfileImage;