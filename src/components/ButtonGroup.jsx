import { useState } from 'react';
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
import ProfileManagement from './ProfileManagement';
import showNotification from './Notification';

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

const ButtonGroup = () => {
  const [personalInfo, setPersonalInfo] = useAtom(personalInfoAtom);
  const [skills, setSkills] = useAtom(skillsAtom);
  const [interests, setInterests] = useAtom(interestsAtom);
  const [education, setEducation] = useAtom(educationAtom);
  const [experience, setExperience] = useAtom(experienceAtom);
  const [customCategories, setCustomCategories] = useAtom(customCategoriesAtom);
  const [selectedColor] = useAtom(selectedColorAtom);
  const [profileImage] = useAtom(profileImageAtom);
  const [errors, setErrors] = useAtom(errorsAtom);
  const [touchedFields, setTouchedFields] = useAtom(touchedFieldsAtom);
  const [showProfileList, setShowProfileList] = useState(false);
  const [testMode] = useState(1);

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
      <div className="button-group">
        <button onClick={exportToPDF} className="export-button">
          Wyeksportuj jako PDF
        </button>
        
        <button onClick={() => setShowProfileList(!showProfileList)} className="button">
          Wczytaj profil
        </button>

        {testMode === 1 && (
          <button onClick={populateTestData} className="test-button">
            Wypełnij danymi testowymi
          </button>
        )}
      </div>

      <ProfileManagement 
        showProfileList={showProfileList}
        setShowProfileList={setShowProfileList}
      />
    </>
  );
};

export default ButtonGroup;