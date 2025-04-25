import { useAtom } from 'jotai';
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

  return (
    <div className="profile-image-section">
      <div className="profile-image-container">
        {profileImage ? (
          <img src={profileImage} alt="Profile" className="profile-preview" />
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