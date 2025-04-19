import { atom } from 'jotai';
import { sectionConfig } from '../data/sectionConfig';

const createEmptyAtom = (defaultValue) => atom(defaultValue);

export const personalInfoAtom = createEmptyAtom({
  firstName: '',
  lastName: '',
  address: '',
});

export const skillsAtom = createEmptyAtom(['']);
export const interestsAtom = createEmptyAtom(['']);
export const educationAtom = createEmptyAtom([{ school: '', city: '', period: '', field: '' }]);
export const experienceAtom = createEmptyAtom([{ company: '', position: '', period: '' }]);
export const customCategoriesAtom = createEmptyAtom([]);
export const selectedColorAtom = createEmptyAtom('#001f3f');
export const profileImageAtom = createEmptyAtom(null);

export const sectionsOrderAtom = createEmptyAtom(
  Object.entries(sectionConfig)
    .sort((a, b) => a[1].defaultOrder - b[1].defaultOrder)
    .map(([_, config]) => config)
);