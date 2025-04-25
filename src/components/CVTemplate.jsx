const CVTemplate = ({
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
}) => {
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
            list-style: none;
            padding-left: 0;
            margin: 0;
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
          h2 {
            margin-top: 0;
            margin-bottom: 20px;
          }
          h3 {
            margin: 15px 0 10px 0;
            font-size: 16px;
          }
          p {
            margin: 0 0 10px 0;
          }
          .profile-image {
            width: 180px;
            height: 220px;
            object-fit: cover;
            margin-bottom: 20px;
            display: ${profileImage ? 'block' : 'none'};
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="left-section">
            <h2>${personalInfo.fullName || ''}</h2>
            ${profileImage ? `<img src="${profileImage}" class="profile-image" alt="Profile">` : ''}
            
            <h3>Adres</h3>
            <p>${personalInfo.addressLine1 || ''}</p>
            <p>${personalInfo.addressLine2 || ''}</p>
            
            <h3>Telefon</h3>
            <p>${personalInfo.phoneNumber || ''}</p>
            
            <h3>Data urodzenia</h3>
            <p>${personalInfo.birthDate || ''}</p>
            
            ${interests?.length ? `
              <h3>Zainteresowania</h3>
              <ul>
                ${interests.map(interest => `<li>${interest}</li>`).join('')}
              </ul>
            ` : ''}
            
            ${traits?.length ? `
              <h3>Cechy</h3>
              <ul>
                ${traits.map(trait => `<li>${trait}</li>`).join('')}
              </ul>
            ` : ''}
          </div>

          <div class="right-section">
            ${education?.length ? `
              <div class="content">
                <div class="header">Wykształcenie</div>
                ${education.map(edu => 
                  `<p><strong>${edu.school || ''}</strong>, ${edu.city || ''}<br>${edu.period || ''}<br>${edu.field || ''}</p>`
                ).join('')}
              </div>
            ` : ''}

            ${experience?.length ? `
              <div class="content">
                <div class="header">Doświadczenie</div>
                ${experience.map(exp => 
                  `<p><strong>${exp.company || ''}</strong><br>${exp.position || ''}<br>${exp.period || ''}</p>`
                ).join('')}
              </div>
            ` : ''}

            ${skills?.length ? `
              <div class="content">
                <div class="header">Umiejętności</div>
                <ul>
                  ${skills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
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