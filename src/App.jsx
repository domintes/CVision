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
            }
            .container {
              display: flex;
              flex-direction: row;
              width: 100%;
              height: 100vh;
            }
            .left-section {
              background-color: ${selectedColor};
              color: white;
              padding: 20px;
              width: 30%;
              box-sizing: border-box;
            }
            .right-section {
              padding: 20px;
              width: 70%;
              box-sizing: border-box;
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="left-section">
              <h2>${personalInfo.firstName} ${personalInfo.lastName}</h2>
              <p>${personalInfo.address.replace(/,\s*$/, '')}</p>
              ${
                interests.length > 0
                  ? `<h3>Zainteresowania:</h3><ul>${interests
                      .map((i) => `<li>${i}</li>`)
                      .join('')}</ul>`
                  : ''
              }
            </div>
            <div class="right-section">
              ${
                education.length > 0
                  ? `<div class="content"><div class="header">Wykształcenie</div>${education
                      .map(
                        (e) =>
                          `<p><strong>${e.school}</strong>, ${e.city}<br>${e.period}<br>${e.field}</p>`
                      )
                      .join('')}</div>`
                  : ''
              }
              ${
                experience.length > 0
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
        </body>
      </html>
    `;

    const options = {
      margin: 0.5,
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
      <h1 className="text-center text-2xl mb-4">Generator CV</h1>

      <div className="personal-info">
        <h2>Informacje osobiste</h2>
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

      <div className="section">
        <h2>Umiejętności</h2>
        {skills.map((skill, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Umiejętność ${index + 1}`}
            value={skill}
            onChange={(e) => handleInputChange(e, null, index, 'skills')}
            className="input"
          />
        ))}
        {skills.length < 10 && (
          <button onClick={() => addField('skills')} className="button">+ Dodaj umiejętność</button>
        )}
      </div>

      <div className="section">
        <h2>Zainteresowania</h2>
        {interests.map((interest, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Zainteresowanie ${index + 1}`}
            value={interest}
            onChange={(e) => handleInputChange(e, null, index, 'interests')}
            className="input"
          />
        ))}
        {interests.length < 10 && (
          <button onClick={() => addField('interests')} className="button">+ Dodaj zainteresowanie</button>
        )}
      </div>

      <div className="section">
        <h2>Edukacja</h2>
        {education.map((edu, index) => (
          <div key={index} className="education-item">
            <input
              type="text"
              placeholder="Nazwa szkoły"
              value={edu.school}
              onChange={(e) => handleInputChange(e, 'school', index, 'education')}
              className="input"
            />
            <input
              type="text"
              placeholder="Miasto"
              value={edu.city}
              onChange={(e) => handleInputChange(e, 'city', index, 'education')}
              className="input"
            />
            <input
              type="text"
              placeholder="Okres"
              value={edu.period}
              onChange={(e) => handleInputChange(e, 'period', index, 'education')}
              className="input"
            />
            <input
              type="text"
              placeholder="Kierunek"
              value={edu.field}
              onChange={(e) => handleInputChange(e, 'field', index, 'education')}
              className="input"
            />
          </div>
        ))}
        <button onClick={() => addField('education')} className="button">+ Dodaj edukację</button>
      </div>

      <div className="section">
        <h2>Doświadczenie</h2>
        {experience.map((exp, index) => (
          <div key={index} className="education-item">
            <input
              type="text"
              placeholder="Nazwa firmy"
              value={exp.company}
              onChange={(e) => handleInputChange(e, 'company', index, 'experience')}
              className="input"
            />
            <input
              type="text"
              placeholder="Stanowisko"
              value={exp.position}
              onChange={(e) => handleInputChange(e, 'position', index, 'experience')}
              className="input"
            />
            <input
              type="text"
              placeholder="Okres"
              value={exp.period}
              onChange={(e) => handleInputChange(e, 'period', index, 'experience')}
              className="input"
            />
          </div>
        ))}
        <button onClick={() => addField('experience')} className="button">+ Dodaj doświadczenie</button>
      </div>

      <div className="section">
        <h2>Kategorie niestandardowe</h2>
        {customCategories.map((category, index) => (
          <div key={index} className="custom-category">
            <input
              type="text"
              placeholder="Nazwa kategorii"
              value={category.name}
              onChange={(e) => handleCustomCategoryChange(e, index, 'name')}
              className="input"
            />
            {category.items.map((item, itemIndex) => (
              <input
                key={itemIndex}
                type="text"
                placeholder={`Element ${itemIndex + 1}`}
                value={item}
                onChange={(e) => handleCustomCategoryChange(e, index, 'item', itemIndex)}
                className="input"
              />
            ))}
            {category.items.length < 10 && (
              <button onClick={() => addCustomCategoryItem(index)} className="button">+ Dodaj element</button>
            )}
          </div>
        ))}
        <button onClick={addCustomCategory} className="button">+ Dodaj kategorię niestandardową</button>
      </div>

      <div className="section">
        <h2>Wybór koloru</h2>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="color-picker"
        />
      </div>

      {testMode === 1 && (
        <button onClick={populateTestData} className="test-button">
          Wypełnij danymi testowymi
        </button>
      )}

      <button onClick={exportToPDF} className="export-button">
        Wyeksportuj jako PDF
      </button>
    </div>
  );
};

export default App;