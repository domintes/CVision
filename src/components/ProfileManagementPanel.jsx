import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import html2pdf from 'html2pdf.js';
import {
  personalInfoAtom,
  skillsAtom,
  interestsAtom,
  traitsAtom,
  educationAtom,
  experienceAtom,
  selectedColorAtom,
  profileImageAtom,
  leftSectionsOrderAtom,
  rightSectionsOrderAtom,
  errorsAtom,
  touchedFieldsAtom
} from '../store/atoms';
import { sectionConfig } from '../data/sectionConfig';
import CVTemplate from './CVTemplate';
import ProfileManagement from './ProfileManagement';
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
  const [traits, setTraits] = useAtom(traitsAtom);
  const [education, setEducation] = useAtom(educationAtom);
  const [experience, setExperience] = useAtom(experienceAtom);
  const [selectedColor] = useAtom(selectedColorAtom);
  const [profileImage] = useAtom(profileImageAtom);
  const [leftSections] = useAtom(leftSectionsOrderAtom);
  const [rightSections] = useAtom(rightSectionsOrderAtom);
  const [errors, setErrors] = useAtom(errorsAtom);
  const [touchedFields, setTouchedFields] = useAtom(touchedFieldsAtom);
  const [showProfileList, setShowProfileList] = useState(false);
  const [showSavePanel, setShowSavePanel] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState([]);

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
      traits,
      education,
      experience,
      skills,
      leftSections,
      rightSections
    });

    const options = {
      margin: 0,
      filename: `${personalInfo.fullName}_cv.pdf`.replace(/\s+/g, '_'),
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().from(content).set(options).save();
  };

  const populateTestData = () => {
    setPersonalInfo({
      fullName: 'Jan Kowalski',
      addressLine1: 'ul. Przykładowa 123/45',
      addressLine2: '00-001 Warszawa',
      birthDate: '1990-01-01',
      phoneNumber: '+48 123 456 789',
    });
    setSkills(['JavaScript', 'React', 'Node.js']);
    setInterests(['Programowanie', 'Muzyka', 'Sport']);
    setTraits(['Komunikatywny', 'Kreatywny', 'Odpowiedzialny']);
    setEducation([
      { school: 'Uniwersytet Warszawski', city: 'Warszawa', period: '2015-2019', field: 'Informatyka' },
    ]);
    setExperience([
      { company: 'Firma X', position: 'Programista', period: '2020-2023' },
    ]);
  };

  return (
    <>
      <div className="sticky-navbar">
        <button onClick={() => setShowSavePanel(!showSavePanel)} className="button">
          Zapisz profil
        </button>
        <button onClick={exportToPDF} className="create-cv-button">
          Stwórz CV
        </button>
        <button onClick={() => setShowProfileList(!showProfileList)} className="button">
          Wczytaj profil
        </button>
      </div>

      <ProfileManagement 
        showProfileList={showProfileList}
        setShowProfileList={setShowProfileList}
        showSavePanel={showSavePanel}
        setShowSavePanel={setShowSavePanel}
      />
    </>
  );
};

export default ProfileManagementPanel;