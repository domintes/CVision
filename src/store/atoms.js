import { atom } from 'jotai';
import { sectionConfig } from '../data/sectionConfig';

const createEmptyAtom = (initialValue) => atom(initialValue);

export const personalInfoAtom = atom({
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  phoneNumber: '',
  birthDate: '',
});

export const skillsAtom = createEmptyAtom(['']);
export const interestsAtom = createEmptyAtom(['']);
export const traitsAtom = createEmptyAtom(['']);
export const educationAtom = createEmptyAtom([{ school: '', city: '', period: '', field: '' }]);
export const experienceAtom = createEmptyAtom([{ company: '', position: '', period: '' }]);
export const selectedColorAtom = createEmptyAtom('#001f3f');
export const profileImageAtom = createEmptyAtom(null);

// Separate atoms for left and right section orders
export const leftSectionsOrderAtom = createEmptyAtom(
  Object.entries(sectionConfig)
    .filter(([_, config]) => config.section === 'left')
    .sort((a, b) => a[1].defaultOrder - b[1].defaultOrder)
    .map(([_, config]) => config)
);

export const rightSectionsOrderAtom = createEmptyAtom(
  Object.entries(sectionConfig)
    .filter(([_, config]) => config.section === 'right')
    .sort((a, b) => a[1].defaultOrder - b[1].defaultOrder)
    .map(([_, config]) => config)
);

export const isCompactLayoutAtom = atom(true);

export const errorsAtom = atom({});
export const touchedFieldsAtom = atom({});