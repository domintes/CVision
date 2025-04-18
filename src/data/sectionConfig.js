export const sectionConfig = {
  personalInfo: {
    id: 'personalInfo',
    title: 'Informacje osobiste',
    defaultOrder: 0,
    inputs: [
      {
        name: 'firstName',
        placeholderText: 'Imię',
        type: 'text'
      },
      {
        name: 'lastName',
        placeholderText: 'Nazwisko',
        type: 'text'
      },
      {
        name: 'address',
        placeholderText: 'Adres (np. Ulica 7D/2, Miasto, Kod pocztowy)',
        type: 'textarea'
      }
    ]
  },
  skills: {
    id: 'skills',
    title: 'Umiejętności',
    defaultOrder: 1,
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
    defaultOrder: 2,
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
    defaultOrder: 3,
    inputs: [
      {
        name: 'company',
        placeholderText: 'Nazwa firmy',
        type: 'text'
      },
      {
        name: 'position',
        placeholderText: 'Stanowisko',
        type: 'text'
      },
      {
        name: 'period',
        placeholderText: 'Okres',
        type: 'text'
      }
    ],
    isArray: true
  },
  interests: {
    id: 'interests',
    title: 'Zainteresowania',
    defaultOrder: 4,
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
  custom: {
    id: 'custom',
    title: 'Kategorie niestandardowe',
    defaultOrder: 5,
    isCustom: true
  }
};