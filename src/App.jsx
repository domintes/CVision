import { useAtom } from 'jotai';
import html2pdf from 'html2pdf.js';
import './app.scss';
import { useState, useEffect } from 'react';
import CVisionSection from './components/CVisionSection';
import {
  personalInfoAtom,
  skillsAtom,
  interestsAtom,
  educationAtom,
  experienceAtom,
  customCategoriesAtom,
  selectedColorAtom,
  profileImageAtom,
  sectionsOrderAtom
} from './store/atoms';

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
  const [testMode] = useState(1);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [showProfileList, setShowProfileList] = useState(false);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  // Load saved profiles on component mount
  useEffect(() => {
    const profiles = Object.keys(localStorage)
      .filter(key => key.startsWith('cvision-profile-'))
      .map(key => ({
        id: key,
        name: key.replace('cvision-profile-', '')
      }));
    setSavedProfiles(profiles);
  }, []);

  const handleInputChange = (e, field) => {
    setPersonalInfo({ ...personalInfo, [field]: e.target.value });
  };

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

  const exportToPDF = () => {
    const content = document.createElement('div');
    content.innerHTML = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              height: 1056px;
            }
            .container {
              display: flex;
              flex-direction: row;
              width: 100%;
              height: 1056px;
            }
            .left-section {
              background-color: ${selectedColor};
              color: white;
              padding: 20px;
              width: 30%;
              box-sizing: border-box;
              height: 1056px;
            }
            .right-section {
              padding: 20px;
              width: 70%;
              box-sizing: border-box;
              color: black;
            }
            .header {
              color: ${selectedColor};
              font-size: 18px;
              text-transform: uppercase;
              margin-bottom: 10px;
            }
            .content {
              margin-bottom: 20px;
            }
            ul {
              padding-left: 20px;
            }
            ul li {
              margin-bottom: 5px;
            }
            .footer {
              text-align: center;
              margin-top: auto;
              font-size: 12px;
              color: gray;
              position: absolute;
              bottom: 24px;
              left: 120px;
              width: 100%;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="left-section">
              ${profileImage ? `<img src="${profileImage}" style="width: 180px; height: 220px; object-fit: cover; margin-bottom: 20px;">` : ''}
              <h2>${personalInfo.firstName} ${personalInfo.lastName}</h2>
              <p>${personalInfo.address.replace(/,\s*$/, '')}</p>
              ${interests.length > 0
        ? `<h3>Zainteresowania:</h3><ul>${interests
          .map((i) => `<li>${i}</li>`)
          .join('')}</ul>`
        : ''
      }
            </div>
            <div class="right-section">
              ${education.length > 0
        ? `<div class="content"><div class="header">Wykształcenie</div>${education
          .map(
            (e) =>
              `<p><strong>${e.school}</strong>, ${e.city}<br>${e.period}<br>${e.field}</p>`
          )
          .join('')}</div>`
        : ''
      }
              ${experience.length > 0
        ? `<div class="content"><div class="header">Doświadczenie</div>${experience
          .map(
            (e) =>
              `<p><strong>${e.company}</strong><br>${e.position}<br>${e.period}</p>`
          )
          .join('')}</div>`
        : ''
      }
              ${skills.length > 0
        ? `<div class="content"><div class="header">Umiejętności</div><ul>${skills
          .map((skill) => `<li>${skill}</li>`)
          .join('')}</ul></div>`
        : ''
      }
              ${customCategories
        .map(
          (cat) =>
            `<div class="content"><div class="header">${cat.name}</div>${cat.items
              .map((item) => `<p>${item}</p>`)
              .join('')}</div>`
        )
        .join('')}
            </div>
          </div>
          <div class="footer">
            Niniejszy dokument zawiera dane osobowe i jest przeznaczony <br />
            wyłącznie do celów rekrutacyjnych zgodnie z RODO.
          </div>
        </body>
      </html>
    `;

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
    
    // Update saved profiles list
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