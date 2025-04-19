import { useAtom } from 'jotai';
import html2pdf from 'html2pdf.js';
import './app.scss';
import { useState, useEffect } from 'react';
import CVisionSection from './components/CVisionSection';
import CVTemplate from './components/CVTemplate';
import { sectionConfig } from './data/sectionConfig';
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
  errorsAtom,
  touchedFieldsAtom
} from './store/atoms';

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

const App = () => {
  const [personalInfo, setPersonalInfo] = useAtom(personalInfoAtom);
  const [skills, setSkills] = useAtom(skillsAtom);
  const [interests, setInterests] = useAtom(interestsAtom);
  const [education, setEducation] = useAtom(educationAtom);
  const [experience, setExperience] = useAtom(experienceAtom);
  const [customCategories, setCustomCategories] = useAtom(customCategoriesAtom);
  const [selectedColor, setSelectedColor] = useAtom(selectedColorAtom);
  const [profileImage, setProfileImage] = useAtom(profileImageAtom);
  const [sections, setSections] = useAtom(sectionsOrderAtom);
  const [errors, setErrors] = useAtom(errorsAtom);
  const [touchedFields, setTouchedFields] = useAtom(touchedFieldsAtom);
  const [testMode] = useState(1);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [showProfileList, setShowProfileList] = useState(false);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  useEffect(() => {
    const profiles = Object.keys(localStorage)
      .filter(key => key.startsWith('cvision-profile-'))
      .map(key => ({
        id: key,
        name: key.replace('cvision-profile-', '')
      }));
    setSavedProfiles(profiles);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const moveSection = (index, direction) => {
    const newSections = [...sections];
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === 'down' && index < sections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    setSections(newSections);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const newSections = [...sections];
    const [movedSection] = newSections.splice(dragIndex, 1);
    newSections.splice(dropIndex, 0, movedSection);
    setSections(newSections);
  };

  const validateAllFields = () => {
    const allErrors = {};
    let hasErrors = false;

    // Validate personal info
    sectionConfig.personalInfo.inputs.forEach(input => {
      if (input.validation) {
        const error = validate(personalInfo[input.name], input.validation);
        if (error) {
          allErrors[`personalInfo-${input.name}`] = error;
          hasErrors = true;
        }
      }
    });

    // Validate experience
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

  const saveData = () => {
    if (!showSaveInput) {
      setShowSaveInput(true);
      return;
    }

    if (!newProfileName.trim()) {
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

    const profileId = `cvision-profile-${newProfileName}`;
    localStorage.setItem(profileId, JSON.stringify(data));
    
    setSavedProfiles(prev => {
      const exists = prev.some(p => p.id === profileId);
      if (!exists) {
        return [...prev, { id: profileId, name: newProfileName }];
      }
      return prev;
    });
    
    showNotification('Profil został zapisany');
    setShowSaveInput(false);
    setNewProfileName('');
  };

  const loadData = (profileId) => {
    const savedData = localStorage.getItem(profileId);
    if (savedData) {
      const data = JSON.parse(savedData);
      
      requestAnimationFrame(() => {
        setPersonalInfo(data.personalInfo);
        setSkills(data.skills);
        setInterests(data.interests);
        setEducation(data.education);
        setExperience(data.experience);
        setCustomCategories(data.customCategories);
        setSelectedColor(data.selectedColor);
        setProfileImage(data.profileImage);
        setSections(data.sections);
        
        showNotification('Profil został wczytany');
      });
    }
    setShowProfileList(false);
  };

  const deleteProfile = (profileId, event) => {
    event.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć ten profil?')) {
      localStorage.removeItem(profileId);
      setSavedProfiles(prev => prev.filter(profile => profile.id !== profileId));
      showNotification('Profil został usunięty');
    }
  };

  const showNotification = (message, isError = false) => {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 20px';
    notification.style.background = isError ? 'rgba(255, 0, 0, 0.9)' : 'rgba(0, 123, 255, 0.9)';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
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
    <div className="cv-builder bg-gray-800 text-white p-6">
      <h1 className="app-header text-2xl mb-4">CVision</h1>

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
            {profileImage ? 'Zmień zdjęcie' : 'Dodaj zdjęcie'}
          </label>
        </div>
      </div>

      {sections.map((section, index) => (
        <CVisionSection
          key={section.id}
          section={section}
          index={index}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMove={moveSection}
        />
      ))}

      <div className="section color-picker-section">
        <h2>Wybór koloru</h2>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="color-picker"
        />
      </div>

      <div className="button-group">
        <button onClick={exportToPDF} className="export-button">
          Wyeksportuj jako PDF
        </button>
        {showSaveInput ? (
          <div className="save-profile-input">
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Nazwa profilu"
              className="profile-name-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveData();
                } else if (e.key === 'Escape') {
                  setShowSaveInput(false);
                  setNewProfileName('');
                }
              }}
              autoFocus
            />
            <button onClick={saveData} className="button save-confirm">
              Zapisz
            </button>
            <button onClick={() => {
              setShowSaveInput(false);
              setNewProfileName('');
            }} className="button cancel">
              Anuluj
            </button>
          </div>
        ) : (
          <button onClick={saveData} className="button">
            Zapisz dane
          </button>
        )}
        <button onClick={() => setShowProfileList(!showProfileList)} className="button">
          Wczytaj profil
        </button>
        {testMode === 1 && (
          <button onClick={populateTestData} className="test-button">
            Wypełnij danymi testowymi
          </button>
        )}
      </div>

      {showProfileList && savedProfiles.length > 0 && (
        <div className="profiles-list">
          <h3>Zapisane profile:</h3>
          <div className="saved-profiles">
            {savedProfiles.map(profile => (
              <div key={profile.id} className="profile-item" onClick={() => loadData(profile.id)}>
                <span>{profile.name}</span>
                <button onClick={(e) => deleteProfile(profile.id, e)} className="delete-profile">
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;