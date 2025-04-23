import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import {
  personalInfoAtom,
  skillsAtom,
  interestsAtom,
  educationAtom,
  experienceAtom,
  customCategoriesAtom,
  selectedColorAtom,
  profileImageAtom,
  sectionsOrderAtom,
} from '../store/atoms';
import { sectionConfig } from '../data/sectionConfig';
import showNotification from './Notification';

const checkProfileCompletion = (profileData) => {
  const hasRequiredPersonalInfo = sectionConfig.personalInfo.inputs.every(input => 
    !input.validation?.isRequired || (profileData.personalInfo[input.name] || '').trim()
  );

  const hasRequiredExperience = profileData.experience.every(exp => 
    sectionConfig.experience.inputs.every(input =>
      !input.validation?.isRequired || (exp[input.name] || '').trim()
    )
  );

  return hasRequiredPersonalInfo && hasRequiredExperience;
};

const loadSavedProfiles = async () => {
  try {
    const result = await window.electron.ipcRenderer.invoke('get-profiles');
    if (result.success) {
      const profiles = [];
      for (const name of result.profiles) {
        const profileResult = await window.electron.ipcRenderer.invoke('load-profile', name);
        if (profileResult.success) {
          const isComplete = checkProfileCompletion(profileResult.data);
          profiles.push({ id: name, name, isComplete, data: profileResult.data });
        }
      }
      return profiles;
    }
    return [];
  } catch (e) {
    console.error('Error loading profiles:', e);
    return [];
  }
};

const ProfileManagement = ({ showProfileList, setShowProfileList }) => {
  const [personalInfo, setPersonalInfo] = useAtom(personalInfoAtom);
  const [skills, setSkills] = useAtom(skillsAtom);
  const [interests, setInterests] = useAtom(interestsAtom);
  const [education, setEducation] = useAtom(educationAtom);
  const [experience, setExperience] = useAtom(experienceAtom);
  const [customCategories, setCustomCategories] = useAtom(customCategoriesAtom);
  const [selectedColor, setSelectedColor] = useAtom(selectedColorAtom);
  const [profileImage, setProfileImage] = useAtom(profileImageAtom);
  const [sections, setSections] = useAtom(sectionsOrderAtom);

  const [savedProfiles, setSavedProfiles] = useState([]);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [editingProfile, setEditingProfile] = useState(null);

  // Load saved profiles on mount
  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles = await loadSavedProfiles();
      setSavedProfiles(profiles);
    };
    fetchProfiles();
  }, []);

  const saveData = async (profileName = newProfileName) => {
    if (typeof profileName !== 'string') {
      profileName = String(profileName || newProfileName || '');
    }
    
    if (!profileName && !showSaveInput) {
      setShowSaveInput(true);
      // Focus the input after showing it
      setTimeout(() => {
        const input = document.querySelector('.profile-name-input');
        if (input) input.focus();
      }, 0);
      return;
    }

    if (!profileName.trim()) {
      showNotification('Podaj nazwę profilu', true);
      return;
    }

    const data = {
      personalInfo,
      skills,
      interests,
      education,
      experience,
      customCategories,
      selectedColor,
      profileImage,
      sections
    };

    try {
      const result = await window.electron.ipcRenderer.invoke('save-profile', {
        data,
        profileName: profileName.trim()
      });
      
      if (result.success) {
        const updatedProfiles = await loadSavedProfiles();
        setSavedProfiles(updatedProfiles);
        showNotification('Profil został zapisany');
        setShowSaveInput(false);
        setNewProfileName('');
        setEditingProfile(null);
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      showNotification('Błąd podczas zapisywania profilu', true);
      console.error('Error saving profile:', e);
    }
  };

  const loadData = async (profileId) => {
    try {
      const result = await window.electron.ipcRenderer.invoke('load-profile', profileId);
      if (result.success) {
        const data = result.data;
        
        setPersonalInfo(data.personalInfo || {});
        setSkills(data.skills || []);
        setInterests(data.interests || []);
        setEducation(data.education || []);
        setExperience(data.experience || []);
        setCustomCategories(data.customCategories || []);
        setSelectedColor(data.selectedColor || '#001f3f');
        setProfileImage(data.profileImage || null);
        setSections(data.sections || []);
        
        showNotification('Profil został wczytany');
        setShowProfileList(false);
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      showNotification('Błąd podczas wczytywania profilu', true);
      console.error('Error loading profile:', e);
    }
  };

  const deleteProfile = async (profileId, event) => {
    event.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć ten profil?')) {
      try {
        const result = await window.electron.ipcRenderer.invoke('delete-profile', profileId);
        if (result.success) {
          setSavedProfiles(prev => prev.filter(profile => profile.id !== profileId));
          showNotification('Profil został usunięty');
        } else {
          throw new Error(result.error);
        }
      } catch (e) {
        showNotification('Błąd podczas usuwania profilu', true);
        console.error('Error deleting profile:', e);
      }
    }
  };

  return (
    <>
      {showSaveInput ? (
        <div className="save-profile-section">
          <h4>Utwórz nowy profil</h4>
          <div className="save-profile-input">
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Nazwa profilu"
              className="profile-name-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newProfileName?.trim()) {
                  e.preventDefault();
                  saveData(newProfileName);
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  setShowSaveInput(false);
                  setNewProfileName('');
                }
              }}
            />
            <button 
              onClick={(e) => {
                e.preventDefault();
                if (newProfileName?.trim()) {
                  saveData(newProfileName);
                } else {
                  showNotification('Podaj nazwę profilu', true);
                }
              }} 
              className="button save-confirm"
            >
              Zapisz
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                setShowSaveInput(false);
                setNewProfileName('');
              }} 
              className="button cancel"
            >
              Anuluj
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowSaveInput(true)} className="button">
          Zapisz profil
        </button>
      )}

      {showProfileList && savedProfiles.length > 0 && (
        <div className="profiles-list">
          <h3>Wczytaj profil</h3>
          <div className="profile-management-grid">
            <div className="saved-profiles">
              {savedProfiles.map(profile => (
                <div 
                  key={profile.id} 
                  className={`profile-item ${editingProfile === profile.id ? 'editing' : ''}`} 
                  onClick={() => {
                    if (!editingProfile) {
                      setEditingProfile(profile.id);
                    }
                  }}
                >
                  <span>{profile.name}</span>
                  <div className="profile-actions">
                    {editingProfile === profile.id ? (
                      <button 
                        onClick={() => {
                          if (profile.name) {
                            saveData(profile.name);
                            setEditingProfile(null);
                          } else {
                            showNotification('Nieprawidłowa nazwa profilu', true);
                          }
                        }} 
                        className="finish-editing"
                      >
                        Zakończ edycję
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            loadData(profile.id);
                          }} 
                          className="load-profile"
                        >
                          Wczytaj
                        </button>
                        <button 
                          onClick={(e) => deleteProfile(profile.id, e)} 
                          className="delete-profile"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileManagement;