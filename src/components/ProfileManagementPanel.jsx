import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import html2pdf from 'html2pdf.js';
import {
  personalInfoAtom,
  skillsAtom,
  interestsAtom,
  educationAtom,
  experienceAtom,
  customCategoriesAtom,
  selectedColorAtom,
  profileImageAtom,
  errorsAtom,
  touchedFieldsAtom
} from '../store/atoms';
import { sectionConfig } from '../data/sectionConfig';
import CVTemplate from './CVTemplate';
import showNotification from './Notification';
import './ProfileManagementPanel.scss';

const validate = (value, validation) => {
  if (!validation) return null;
  
  if (validation.isRequired && (!value || value.trim() === '')) {
    return 'To pole jest wymagane';
  }
  
  if (validation.minLength && value.length < validation.minLength) {
    return `Minimalna długość to ${validation.minLength} znaków`;
  }
  
  return null;
};

const scrollToFirstError = () => {
  const firstErrorEl = document.querySelector('.input.error, .textarea.error');
  if (firstErrorEl) {
    firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
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

const ProfileManagementPanel = () => {
  const [personalInfo, setPersonalInfo] = useAtom(personalInfoAtom);
  const [skills, setSkills] = useAtom(skillsAtom);
  const [interests, setInterests] = useAtom(interestsAtom);
  const [education, setEducation] = useAtom(educationAtom);
  const [experience, setExperience] = useAtom(experienceAtom);
  const [customCategories, setCustomCategories] = useAtom(customCategoriesAtom);
  const [selectedColor, setSelectedColor] = useAtom(selectedColorAtom);
  const [profileImage, setProfileImage] = useAtom(profileImageAtom);
  const [errors, setErrors] = useAtom(errorsAtom);
  const [touchedFields, setTouchedFields] = useAtom(touchedFieldsAtom);

  const [savedProfiles, setSavedProfiles] = useState([]);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [showProfileList, setShowProfileList] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [editingProfile, setEditingProfile] = useState(null);
  const [testMode] = useState(1);

  // Load saved profiles on mount
  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles = await loadSavedProfiles();
      setSavedProfiles(profiles);
    };
    fetchProfiles();
  }, []);

  const validateAllFields = () => {
    const allErrors = {};
    let hasErrors = false;

    sectionConfig.personalInfo.inputs.forEach(input => {
      if (input.validation) {
        const error = validate(personalInfo[input.name], input.validation);
        if (error) {
          allErrors[`personalInfo-${input.name}`] = error;
          hasErrors = true;
        }
      }
    });

    experience.forEach((exp, idx) => {
      sectionConfig.experience.inputs.forEach(input => {
        if (input.validation) {
          const error = validate(exp[input.name], input.validation);
          if (error) {
            allErrors[`experience-${idx}-${input.name}`] = error;
            hasErrors = true;
          }
        }
      });
    });

    setErrors(allErrors);
    setTouchedFields(
      Object.keys(allErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (hasErrors) {
      scrollToFirstError();
    }

    return !hasErrors;
  };

  const exportToPDF = () => {
    if (!validateAllFields()) {
      showNotification('Proszę wypełnić wszystkie wymagane pola', true);
      return;
    }

    const content = document.createElement('div');
    content.innerHTML = CVTemplate({
      selectedColor,
      profileImage,
      personalInfo,
      interests,
      education,
      experience,
      skills,
      customCategories
    });

    const options = {
      margin: 0,
      filename: `${personalInfo.firstName}_${personalInfo.lastName}_cv.pdf`.replace(
        /\s+/g,
        '_'
      ),
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().from(content).set(options).save();
  };

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

  const exportProfile = async (profileData) => {
    try {
      const result = await window.electron.ipcRenderer.invoke('export-profile', {
        data: profileData
      });
      
      if (result.success) {
        showNotification('Profil został wyeksportowany');
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      showNotification('Błąd podczas eksportowania profilu', true);
      console.error('Error exporting profile:', e);
    }
  };

  const importProfileFromFile = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('import-profile');
      
      // If user cancelled file selection, just return silently
      if (result.cancelled) {
        return;
      }

      // If there's an invalid file format
      if (result.error === 'invalid_format') {
        showNotification('Nieprawidłowy format pliku', true);
        return;
      }

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
        
        showNotification('Profil został wczytany z pliku');
        setShowProfileList(false);
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      // Only show error notification for actual errors, not cancellation
      if (e.message !== 'No file selected') {
        showNotification('Błąd podczas wczytywania profilu z pliku', true);
        console.error('Error importing profile:', e);
      }
    }
  };

  const populateTestData = () => {
    setPersonalInfo({
      firstName: 'Jan',
      lastName: 'Kowalski',
      address: 'Warszawa, ul. Przykładowa 123',
    });
    setSkills(['JavaScript', 'React', 'Node.js']);
    setInterests(['Programowanie', 'Muzyka', 'Sport']);
    setEducation([
      { school: 'Uniwersytet Warszawski', city: 'Warszawa', period: '2015-2019', field: 'Informatyka' },
    ]);
    setExperience([
      { company: 'Firma X', position: 'Programista', period: '2020-2023' },
    ]);
    setCustomCategories([
      { name: 'Projekty', items: ['Projekt A', 'Projekt B'] },
    ]);
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
        <div className="button-group">
          <button onClick={exportToPDF} className="export-button">
            Wyeksportuj jako PDF
          </button>
          
          <button onClick={() => setShowSaveInput(true)} className="button">
            Zapisz profil
          </button>
          
          <button onClick={() => setShowProfileList(!showProfileList)} className="button">
            Wczytaj profil
          </button>

          <button 
            onClick={() => exportProfile({
              personalInfo,
              skills,
              interests,
              education,
              experience,
              customCategories,
              selectedColor,
              profileImage,
            })} 
            className="button"
          >
            Eksportuj profil
          </button>

          {testMode === 1 && (
            <button onClick={populateTestData} className="test-button">
              Wypełnij danymi testowymi
            </button>
          )}
        </div>
      )}

      {showProfileList && savedProfiles.length > 0 && (
        <div className="profiles-list">
          <div className="load-profile-header-section">
            <h3>Wczytaj profil</h3>
            <button onClick={importProfileFromFile} className="import-profile-btn">
              Wczytaj profil z pliku
            </button>
            <button onClick={() => setShowProfileList(false)} className="close-profile-panel-button">
              ✕
            </button>
          </div>
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
                  <div className="user-profile-name">{profile.name}</div>
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
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileManagementPanel;