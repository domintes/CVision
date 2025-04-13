import { useState } from 'react';
import html2pdf from 'html2pdf.js';
import './app.scss';

const App = () => {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
  });
  const [skills, setSkills] = useState(['']);
  const [interests, setInterests] = useState(['']);
  const [education, setEducation] = useState([{ school: '', city: '', period: '', field: '' }]);
  const [experience, setExperience] = useState([{ company: '', position: '', period: '' }]);
  const [customCategories, setCustomCategories] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#001f3f');
  const [testMode, setTestMode] = useState(1);
  const [profileImage, setProfileImage] = useState(null);
  const [sections, setSections] = useState([
    { id: 'skills', title: 'Umiejętności' },
    { id: 'interests', title: 'Zainteresowania' },
    { id: 'education', title: 'Wykształcenie' },
    { id: 'experience', title: 'Doświadczenie' },
    { id: 'custom', title: 'Kategorie niestandardowe' }
  ]);

  const handleInputChange = (e, field, index, category) => {
    if (category === 'personalInfo') {
      setPersonalInfo({ ...personalInfo, [field]: e.target.value });
    } else if (category === 'skills') {
      const updatedSkills = [...skills];
      updatedSkills[index] = e.target.value;
      setSkills(updatedSkills);
    } else if (category === 'interests') {
      const updatedInterests = [...interests];
      updatedInterests[index] = e.target.value;
      setInterests(updatedInterests);
    } else if (category === 'education') {
      const updatedEducation = [...education];
      updatedEducation[index][field] = e.target.value;
      setEducation(updatedEducation);
    } else if (category === 'experience') {
      const updatedExperience = [...experience];
      updatedExperience[index][field] = e.target.value;
      setExperience(updatedExperience);
    }
  };

  const addField = (category) => {
    if (category === 'skills' && skills.length < 10) {
      setSkills([...skills, '']);
    } else if (category === 'interests' && interests.length < 10) {
      setInterests([...interests, '']);
    } else if (category === 'education') {
      setEducation([...education, { school: '', city: '', period: '', field: '' }]);
    } else if (category === 'experience') {
      setExperience([...experience, { company: '', position: '', period: '' }]);
    }
  };

  const addCustomCategory = () => {
    setCustomCategories([...customCategories, { name: '', items: [''] }]);
  };

  const handleCustomCategoryChange = (e, index, field, itemIndex) => {
    const updatedCategories = [...customCategories];
    if (field === 'name') {
      updatedCategories[index].name = e.target.value;
    } else {
      updatedCategories[index].items[itemIndex] = e.target.value;
    }
    setCustomCategories(updatedCategories);
  };

  const addCustomCategoryItem = (index) => {
    const updatedCategories = [...customCategories];
    if (updatedCategories[index].items.length < 10) {
      updatedCategories[index].items.push('');
    }
    setCustomCategories(updatedCategories);
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
              ${profileImage ? `<img src="${profileImage}" style="width: 140px; height: 220px; object-fit: cover; margin-bottom: 20px;">` : ''}
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

      <div className="personal-info">
        <h2>Informacje osobiste</h2>
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
        <input
          type="text"
          placeholder="Imię"
          value={personalInfo.firstName}
          onChange={(e) => handleInputChange(e, 'firstName', null, 'personalInfo')}
          className="input"
        />
        <input
          type="text"
          placeholder="Nazwisko"
          value={personalInfo.lastName}
          onChange={(e) => handleInputChange(e, 'lastName', null, 'personalInfo')}
          className="input"
        />
        <textarea
          placeholder="Adres (np. Ulica 7D/2, Miasto, Kod pocztowy)"
          value={personalInfo.address}
          onChange={(e) => handleInputChange(e, 'address', null, 'personalInfo')}
          className="textarea"
        />
      </div>

      {sections.map((section, index) => {
        const SectionContent = () => {
          switch (section.id) {
            case 'skills':
              return (
                <>
                  {skills.map((skill, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Umiejętność ${idx + 1}`}
                      value={skill}
                      onChange={(e) => handleInputChange(e, null, idx, 'skills')}
                      className="input"
                    />
                  ))}
                  {skills.length < 10 && (
                    <button onClick={() => addField('skills')} className="button add-element-button">+ Dodaj umiejętność</button>
                  )}
                </>
              );
            case 'interests':
              return (
                <>
                  {interests.map((interest, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Zainteresowanie ${idx + 1}`}
                      value={interest}
                      onChange={(e) => handleInputChange(e, null, idx, 'interests')}
                      className="input"
                    />
                  ))}
                  {interests.length < 10 && (
                    <button onClick={() => addField('interests')} className="button add-element-button">+ Dodaj zainteresowanie</button>
                  )}
                </>
              );
            case 'education':
              return (
                <>
                  {education.map((edu, idx) => (
                    <div key={idx} className="education-item">
                      <input
                        type="text"
                        placeholder="Nazwa szkoły"
                        value={edu.school}
                        onChange={(e) => handleInputChange(e, 'school', idx, 'education')}
                        className="input"
                      />
                      <input
                        type="text"
                        placeholder="Miasto"
                        value={edu.city}
                        onChange={(e) => handleInputChange(e, 'city', idx, 'education')}
                        className="input"
                      />
                      <input
                        type="text"
                        placeholder="Okres"
                        value={edu.period}
                        onChange={(e) => handleInputChange(e, 'period', idx, 'education')}
                        className="input"
                      />
                      <input
                        type="text"
                        placeholder="Kierunek"
                        value={edu.field}
                        onChange={(e) => handleInputChange(e, 'field', idx, 'education')}
                        className="input"
                      />
                    </div>
                  ))}
                  <button onClick={() => addField('education')} className="button add-element-button">+ Dodaj edukację</button>
                </>
              );
            case 'experience':
              return (
                <>
                  {experience.map((exp, idx) => (
                    <div key={idx} className="education-item">
                      <input
                        type="text"
                        placeholder="Nazwa firmy"
                        value={exp.company}
                        onChange={(e) => handleInputChange(e, 'company', idx, 'experience')}
                        className="input"
                      />
                      <input
                        type="text"
                        placeholder="Stanowisko"
                        value={exp.position}
                        onChange={(e) => handleInputChange(e, 'position', idx, 'experience')}
                        className="input"
                      />
                      <input
                        type="text"
                        placeholder="Okres"
                        value={exp.period}
                        onChange={(e) => handleInputChange(e, 'period', idx, 'experience')}
                        className="input"
                      />
                    </div>
                  ))}
                  <button onClick={() => addField('experience')} className="button add-element-button">+ Dodaj doświadczenie</button>
                </>
              );
            case 'custom':
              return (
                <>
                  {customCategories.map((category, idx) => (
                    <div key={idx} className="custom-category">
                      <input
                        type="text"
                        placeholder="Nazwa kategorii"
                        value={category.name}
                        onChange={(e) => handleCustomCategoryChange(e, idx, 'name')}
                        className="input"
                      />
                      {category.items.map((item, itemIndex) => (
                        <input
                          key={itemIndex}
                          type="text"
                          placeholder={`Element ${itemIndex + 1}`}
                          value={item}
                          onChange={(e) => handleCustomCategoryChange(e, idx, 'item', itemIndex)}
                          className="input"
                        />
                      ))}
                      {category.items.length < 10 && (
                        <button onClick={() => addCustomCategoryItem(idx)} className="button add-element-button">+ Dodaj element</button>
                      )}
                    </div>
                  ))}
                  <button onClick={addCustomCategory} className="button">+ Dodaj kategorię niestandardową</button>
                </>
              );
            default:
              return null;
          }
        };

        return (
          <div
            key={section.id}
            className="section"
            draggable={true}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnter={(e) => e.currentTarget.classList.add('dragging-over')}
            onDragLeave={(e) => e.currentTarget.classList.remove('dragging-over')}
          >
            <div className="section-header">
              <div className="drag-handle" title="Przeciągnij aby zmienić kolejność">
                <span>⋮⋮</span>
              </div>
              <h2>{section.title}</h2>
              <div className="section-controls">
                <button
                  onClick={() => moveSection(index, 'up')}
                  className="order-button"
                  disabled={index === 0}
                  title="Przesuń sekcję w górę"
                >
                  <span className="arrow">↑</span>
                </button>
                <button
                  onClick={() => moveSection(index, 'down')}
                  className="order-button"
                  disabled={index === sections.length - 1}
                  title="Przesuń sekcję w dół"
                >
                  <span className="arrow">↓</span>
                </button>
              </div>
            </div>
            <SectionContent />
          </div>
        );
      })}

      <div className="section color-picker-section">
        <h2>Wybór koloru</h2>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="color-picker"
        />
      </div>

      <button onClick={exportToPDF} className="export-button">
        Wyeksportuj jako PDF
      </button>

      {testMode === 1 && (
        <button onClick={populateTestData} className="test-button">
          Wypełnij danymi testowymi
        </button>
      )}
    </div>
  );
};

export default App;