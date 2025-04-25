const CVTemplate = ({
  selectedColor,
  profileImage,
  personalInfo,
  interests,
  traits,
  education,
  experience,
  skills,
  customCategories,
  leftSections,
  rightSections
}) => {
  // Helper function to render left section content
  const renderLeftSection = (sectionId) => {
    switch (sectionId) {
      case 'interests':
        return interests?.length > 0 ? (
          <>
            <h3 className="left-section-normal-header">Zainteresowania</h3>
            <ul>
              {interests.map((interest, idx) => (
                <li key={idx}>{interest}</li>
              ))}
            </ul>
          </>
        ) : null;
      case 'traits':
        return traits?.length > 0 ? (
          <>
            <h3 className="left-section-normal-header">Cechy</h3>
            <ul>
              {traits.map((trait, idx) => (
                <li key={idx}>{trait}</li>
              ))}
            </ul>
          </>
        ) : null;
      default:
        return null;
    }
  };

  // Helper function to render right section content
  const renderRightSection = (sectionId) => {
    switch (sectionId) {
      case 'education':
        return education?.length > 0 ? (
          <div className="content">
            <div className="header">Wykształcenie</div>
            {education.map((edu, idx) => (
              <p key={idx}>
                <strong>{edu.school}</strong>, {edu.city}<br/>{edu.period}<br/>{edu.field}
              </p>
            ))}
          </div>
        ) : null;
      case 'experience':
        return experience?.length > 0 ? (
          <div className="content">
            <div className="header">Doświadczenie</div>
            {experience.map((exp, idx) => (
              <p key={idx}>
                <strong>{exp.company}</strong><br/>{exp.position}<br/>{exp.period}
              </p>
            ))}
          </div>
        ) : null;
      case 'skills':
        return skills?.length > 0 ? (
          <div className="content">
            <div className="header">Umiejętności</div>
            <ul>
              {skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
        ) : null;
      case 'custom':
        return customCategories?.length > 0 ? (
          customCategories.map((cat, idx) => (
            <div key={idx} className="content">
              <div className="header">{cat.name}</div>
              {cat.items.map((item, itemIdx) => (
                <p key={itemIdx}>{item}</p>
              ))}
            </div>
          ))
        ) : null;
      default:
        return null;
    }
  };

  return `
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
            <h2>${personalInfo.firstName} ${personalInfo.lastName}</h2>
            ${profileImage ? `<img src="${profileImage}" style="width: 180px; height: 220px; object-fit: cover; margin-bottom: 20px;">` : ''}
            <h3 class="left-section-normal-header">Dane osobowe</h3>
            <h4 class="left-section-small-header">Data urodzenia</h4>
            <p class="personal-info-value">${personalInfo.birthDate || ''}</p>
            <h4 class="left-section-small-header">Numer telefonu</h4>
            <p class="personal-info-value">${personalInfo.phoneNumber || ''}</p>
            <h4 class="left-section-small-header">Adres E-mail</h4>
            <p class="personal-info-value">${personalInfo.email || ''}</p>
            <h4 class="left-section-small-header">Adres</h4>
            <p class="personal-info-value">${personalInfo.address || ''}</p>
            ${leftSections
              .filter(section => section.id !== 'personalInfo')
              .map(section => renderLeftSection(section.id))
              .filter(Boolean)
              .join('')}
          </div>
          <div class="right-section">
            ${rightSections
              .map(section => renderRightSection(section.id))
              .filter(Boolean)
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
};

export default CVTemplate;