export const sectionConfig = {
  personalInfo: {
    id: 'personalInfo',
    title: 'Informacje osobiste',
    defaultOrder: 0,
    section: 'left',
    inputs: [
      {
        name: 'fullName',
        placeholderText: 'Imię i Nazwisko',
        type: 'text',
        validation: {
          isRequired: true,
          minLength: 2
        }
      },
      {
        name: 'birthDate',
        placeholderText: 'Data urodzenia',
        type: 'date',
        validation: {
          isRequired: true
        }
      },
      {
        name: 'phoneNumber',
        placeholderText: 'Numer telefonu',
        type: 'tel',
        validation: {
          isRequired: true
        }
      },
      {
        name: 'addressLine1',
        placeholderText: 'Ulica, nr. mieszkania / nr. domu',
        type: 'text',
        validation: {
          isRequired: true
        }
      },
      {
        name: 'addressLine2',
        placeholderText: 'Kod pocztowy, nazwa miejscowości',
        type: 'text',
        validation: {
          isRequired: true
        }
      }
    ]
  },
  interests: {
    id: 'interests',
    title: 'Zainteresowania',
    defaultOrder: 1,
    section: 'left',
    inputs: [
      {
        name: 'interest',
        placeholderText: 'Podaj zainteresowanie',
        type: 'text',
        isArray: true,
        maxItems: 10
      }
    ]
  },
  traits: {
    id: 'traits',
    title: 'Cechy',
    defaultOrder: 2,
    section: 'left',
    inputs: [
      {
        name: 'trait',
        placeholderText: 'Podaj cechę',
        type: 'text',
        isArray: true,
        maxItems: 10
      }
    ]
  },
  skills: {
    id: 'skills',
    title: 'Umiejętności',
    defaultOrder: 0,
    section: 'right',
    inputs: [
      {
        name: 'skill',
        placeholderText: 'Podaj umiejętność',
        type: 'text',
        isArray: true,
        maxItems: 10
      }
    ]
  },
  education: {
    id: 'education',
    title: 'Wykształcenie',
    defaultOrder: 1,
    section: 'right',
    inputs: [
      {
        name: 'school',
        placeholderText: 'Nazwa szkoły',
        type: 'text'
      },
      {
        name: 'city',
        placeholderText: 'Miasto',
        type: 'text'
      },
      {
        name: 'period',
        placeholderText: 'Okres',
        type: 'text'
      },
      {
        name: 'field',
        placeholderText: 'Kierunek',
        type: 'text'
      }
    ],
    isArray: true
  },
  experience: {
    id: 'experience',
    title: 'Doświadczenie',
    defaultOrder: 2,
    section: 'right',
    inputs: [
      {
        name: 'company',
        placeholderText: 'Nazwa firmy',
        type: 'text',
        validation: {
          isRequired: true,
          minLength: 2
        }
      },
      {
        name: 'position',
        placeholderText: 'Stanowisko',
        type: 'text',
        validation: {
          isRequired: true
        }
      },
      {
        name: 'period',
        placeholderText: 'Okres',
        type: 'text',
        validation: {
          isRequired: true
        }
      }
    ],
    isArray: true
  }
};