import { atom } from 'jotai';
import { sectionConfig } from '../data/sectionConfig';

export const personalInfoAtom = atom({
  firstName: '',
  lastName: '',
  address: '',
});

export const skillsAtom = atom(['']);
export const interestsAtom = atom(['']);
export const educationAtom = atom([{ school: '', city: '', period: '', field: '' }]);
export const experienceAtom = atom([{ company: '', position: '', period: '' }]);
export const customCategoriesAtom = atom([]);
export const selectedColorAtom = atom('#001f3f');
export const profileImageAtom = atom(null);

export const sectionsOrderAtom = atom(
  Object.entries(sectionConfig)
    .sort((a, b) => a[1].defaultOrder - b[1].defaultOrder)
    .map(([_, config]) => config)
);