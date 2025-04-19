const CVTemplate = ({
  selectedColor,
  profileImage,
  personalInfo,
  interests,
  education,
  experience,
  skills,
  customCategories
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
};

export default CVTemplate;