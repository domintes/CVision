import { useAtom } from 'jotai';
import { FaTimes } from 'react-icons/fa';
import { profileImageAtom } from '../store/atoms';

const ProfileImage = () => {
  const [profileImage, setProfileImage] = useAtom(profileImageAtom);

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

  return (
    <div className="profile-image-section">
      <div className="profile-image-container">
        {profileImage ? (
          <div className="image-wrapper">
            <img src={profileImage} alt="Profile" className="profile-preview" />
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
    </div>
  );
};

export default ProfileImage;