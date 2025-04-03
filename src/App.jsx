import { useState } from 'react';
import './app.css';

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
    // Placeholder for PDF export logic
    console.log('Exporting to PDF...');
  };

  return (
    <div className="cv-builder">
      <h1 className="text-center text-2xl mb-4">CV Generator</h1>

      <div className="personal-info">
        <h2>Personal Information</h2>
        <input
          type="text"
          placeholder="First Name"
          value={personalInfo.firstName}
          onChange={(e) => handleInputChange(e, 'firstName', null, 'personalInfo')}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={personalInfo.lastName}
          onChange={(e) => handleInputChange(e, 'lastName', null, 'personalInfo')}
        />
        <textarea
          placeholder="Address"
          value={personalInfo.address}
          onChange={(e) => handleInputChange(e, 'address', null, 'personalInfo')}
        />
      </div>

      <div className="section">
        <h2>Skills</h2>
        {skills.map((skill, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Skill ${index + 1}`}
            value={skill}
            onChange={(e) => handleInputChange(e, null, index, 'skills')}
          />
        ))}
        {skills.length < 10 && (
          <button onClick={() => addField('skills')}>+ Add Skill</button>
        )}
      </div>

      <div className="section">
        <h2>Interests</h2>
        {interests.map((interest, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Interest ${index + 1}`}
            value={interest}
            onChange={(e) => handleInputChange(e, null, index, 'interests')}
          />
        ))}
        {interests.length < 10 && (
          <button onClick={() => addField('interests')}>+ Add Interest</button>
        )}
      </div>

      <div className="section">
        <h2>Education</h2>
        {education.map((edu, index) => (
          <div key={index} className="education-item">
            <input
              type="text"
              placeholder="School Name"
              value={edu.school}
              onChange={(e) => handleInputChange(e, 'school', index, 'education')}
            />
            <input
              type="text"
              placeholder="City"
              value={edu.city}
              onChange={(e) => handleInputChange(e, 'city', index, 'education')}
            />
            <input
              type="text"
              placeholder="Period"
              value={edu.period}
              onChange={(e) => handleInputChange(e, 'period', index, 'education')}
            />
            <input
              type="text"
              placeholder="Field"
              value={edu.field}
              onChange={(e) => handleInputChange(e, 'field', index, 'education')}
            />
          </div>
        ))}
        <button onClick={() => addField('education')}>+ Add Education</button>
      </div>

      <div className="section">
        <h2>Experience</h2>
        {experience.map((exp, index) => (
          <div key={index} className="education-item">
            <input
              type="text"
              placeholder="Company Name"
              value={exp.company}
              onChange={(e) => handleInputChange(e, 'company', index, 'experience')}
            />
            <input
              type="text"
              placeholder="Position"
              value={exp.position}
              onChange={(e) => handleInputChange(e, 'position', index, 'experience')}
            />
            <input
              type="text"
              placeholder="Period"
              value={exp.period}
              onChange={(e) => handleInputChange(e, 'period', index, 'experience')}
            />
          </div>
        ))}
        <button onClick={() => addField('experience')}>+ Add Experience</button>
      </div>

      <div className="section">
        <h2>Custom Categories</h2>
        {customCategories.map((category, index) => (
          <div key={index} className="custom-category">
            <input
              type="text"
              placeholder="Category Name"
              value={category.name}
              onChange={(e) => handleCustomCategoryChange(e, index, 'name')}
            />
            {category.items.map((item, itemIndex) => (
              <input
                key={itemIndex}
                type="text"
                placeholder={`Item ${itemIndex + 1}`}
                value={item}
                onChange={(e) => handleCustomCategoryChange(e, index, 'item', itemIndex)}
              />
            ))}
            {category.items.length < 10 && (
              <button onClick={() => addCustomCategoryItem(index)}>+ Add Item</button>
            )}
          </div>
        ))}
        <button onClick={addCustomCategory}>+ Add Custom Category</button>
      </div>

      <div className="section">
        <h2>Color Selection</h2>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />
      </div>

      <button onClick={exportToPDF} className="export-button">
        Wyeksportuj jako PDF
      </button>
    </div>
  );
};

export default App;