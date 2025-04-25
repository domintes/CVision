import { useAtom } from 'jotai';
import { 
  FaUser, 
  FaCalendar, 
  FaPhone, 
  FaMapMarker, 
  FaBuilding, 
  FaBriefcase, 
  FaClock,
  FaGraduationCap,
  FaCity,
  FaBook,
  FaStar,
  FaHeart,
  FaCheckCircle
} from 'react-icons/fa';
import {
  personalInfoAtom,
  skillsAtom,
  interestsAtom,
  traitsAtom,
  educationAtom,
  experienceAtom,
  errorsAtom,
  touchedFieldsAtom
} from '../store/atoms';
import { sectionConfig } from '../data/sectionConfig';

const validate = (value, validation) => {
  if (!validation) return null;
  
  if (validation.isRequired && (!value || value.trim() === '')) {
    return 'To pole jest wymagane';
  }
  
  if (validation.minLength && value.length < validation.minLength) {
    return `Minimalna długość to ${validation.minLength} znaków`;
  }
  
  return null;
};

const getInputIcon = (category, field) => {
  const icons = {
    personalInfo: {
      fullName: <FaUser />,
      birthDate: <FaCalendar />,
      phoneNumber: <FaPhone />,
      addressLine1: <FaMapMarker />,
      addressLine2: <FaMapMarker />
    },
    education: {
      school: <FaGraduationCap />,
      city: <FaCity />,
      period: <FaClock />,
      field: <FaBook />
    },
    experience: {
      company: <FaBuilding />,
      position: <FaBriefcase />,
      period: <FaClock />
    },
    skills: { default: <FaStar /> },
    interests: { default: <FaHeart /> },
    traits: { default: <FaCheckCircle /> }
  };

  return icons[category]?.[field] || icons[category]?.default || null;
};

const CVisionSection = ({
  section,
  index,
  sectionType,
  onDragStart,
  onDragOver,
  onDrop,
  onMove,
  totalSections
}) => {
  const [personalInfo, setPersonalInfo] = useAtom(personalInfoAtom);
  const [skills, setSkills] = useAtom(skillsAtom);
  const [interests, setInterests] = useAtom(interestsAtom);
  const [traits, setTraits] = useAtom(traitsAtom);
  const [education, setEducation] = useAtom(educationAtom);
  const [experience, setExperience] = useAtom(experienceAtom);
  const [errors, setErrors] = useAtom(errorsAtom);
  const [touchedFields, setTouchedFields] = useAtom(touchedFieldsAtom);

  const handleInputBlur = (fieldId) => {
    setTouchedFields(prev => ({ ...prev, [fieldId]: true }));
  };

  const validateField = (value, input, fieldId) => {
    if (!input.validation) return;

    const error = validate(value, input.validation);
    setErrors(prev => ({
      ...prev,
      [fieldId]: error
    }));
  };

  const handleInputChange = (e, field, index, category) => {
    const value = e.target.value;
    const element = e.target;
    const fieldId = index !== null ? `${category}-${index}-${field}` : `${category}-${field}`;
    
    // Store current selection/cursor position
    const selectionStart = element.selectionStart;
    const selectionEnd = element.selectionEnd;
    
    switch(category) {
      case 'personalInfo':
        setPersonalInfo(prev => ({ ...prev, [field]: value }));
        validateField(value, sectionConfig[category].inputs.find(i => i.name === field), fieldId);
        break;
      case 'skills':
        setSkills(prev => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
        break;
      case 'interests':
        setInterests(prev => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
        break;
      case 'traits':
        setTraits(prev => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
        break;
      case 'education':
        setEducation(prev => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index] = { ...updated[index], [field]: value };
          }
          return updated;
        });
        break;
      case 'experience':
        setExperience(prev => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index] = { ...updated[index], [field]: value };
          }
          return updated;
        });
        const input = sectionConfig[category].inputs.find(i => i.name === field);
        validateField(value, input, fieldId);
        break;
      default:
        break;
    }

    // Ensure focus and cursor position are maintained after state update
    requestAnimationFrame(() => {
      if (document.activeElement !== element) {
        element.focus();
        try {
          element.setSelectionRange(selectionStart, selectionEnd);
        } catch (e) {
          // Ignore errors for non-text inputs
        }
      }
    });
  };

  const addField = (category) => {
    const config = sectionConfig[category];
    if (!config) return;

    if (config.inputs?.[0]?.isArray) {
      const [values, setValues] = getAtomByCategory(category);
      if (values.length < (config.inputs[0].maxItems || Infinity)) {
        setValues([...values, '']);
      }
    } else if (config.isArray) {
      const [values, setValues] = getAtomByCategory(category);
      const newItem = config.inputs.reduce((acc, input) => {
        acc[input.name] = '';
        return acc;
      }, {});
      setValues([...values, newItem]);
    }
  };

  const getAtomByCategory = (category) => {
    switch(category) {
      case 'personalInfo':
        return [personalInfo, setPersonalInfo];
      case 'skills':
        return [skills, setSkills];
      case 'interests':
        return [interests, setInterests];
      case 'traits':
        return [traits, setTraits];
      case 'education':
        return [education, setEducation];
      case 'experience':
        return [experience, setExperience];
      default:
        return [null, () => {}];
    }
  };

  const renderInputs = (sectionId, itemIndex = 0) => {
    const config = sectionConfig[sectionId];
    if (!config) return null;

    const [values] = getAtomByCategory(sectionId);
    
    return config.inputs?.map((input, inputIndex) => {
      const fieldId = itemIndex !== null ? `${sectionId}-${itemIndex}-${input.name}` : `${sectionId}-${input.name}`;
      const error = touchedFields[fieldId] ? errors[fieldId] : null;
      const icon = getInputIcon(sectionId, input.name);

      if (sectionId === 'personalInfo') {
        const InputComponent = input.type === 'textarea' ? 'textarea' : 'input';
        return (
          <div key={input.name} className="input-wrapper">
            {icon && <span className="input-icon">{icon}</span>}
            <InputComponent
              type={input.type}
              placeholder={input.placeholderText}
              value={values[input.name] || ''}
              onChange={(e) => handleInputChange(e, input.name, null, sectionId)}
              onBlur={() => handleInputBlur(fieldId)}
              className={`${input.type === 'textarea' ? 'textarea' : 'input'} ${error ? 'error' : ''} ${icon ? 'with-icon' : ''}`}
            />
            {error && <div className="error-bubble">{error}</div>}
          </div>
        );
      } else if (config.isArray && !input.isArray) {
        return (
          <div key={`${input.name}-${itemIndex}`} className="input-wrapper">
            {icon && <span className="input-icon">{icon}</span>}
            <input
              type={input.type}
              placeholder={input.placeholderText}
              value={values[itemIndex]?.[input.name] || ''}
              onChange={(e) => handleInputChange(e, input.name, itemIndex, sectionId)}
              onBlur={() => handleInputBlur(fieldId)}
              className={`input ${error ? 'error' : ''} ${icon ? 'with-icon' : ''}`}
            />
            {error && <div className="error-bubble">{error}</div>}
          </div>
        );
      } else if (input.isArray) {
        return (
          <ul key={`${sectionId}-list-${inputIndex}`} className="input-list">
            {values.map((value, idx) => (
              <li key={`${sectionId}-${input.name}-${idx}`}>
                <div className="input-wrapper">
                  {icon && <span className="input-icon">{icon}</span>}
                  <input
                    type={input.type}
                    placeholder={input.placeholderText}
                    value={value || ''}
                    onChange={(e) => handleInputChange(e, null, idx, sectionId)}
                    className={`input ${icon ? 'with-icon' : ''}`}
                  />
                </div>
              </li>
            ))}
          </ul>
        );
      }
      return null;
    });
  };

  const renderSectionContent = () => {
    const config = sectionConfig[section.id];
    if (!config) return null;

    return (
      <div className={`section-content ${section.id}-section`}>
        {config.isArray ? (
          <>
            {getAtomByCategory(section.id)[0].map((_, idx) => (
              <div key={idx} className={`${section.id}-item`}>
                {renderInputs(section.id, idx)}
              </div>
            ))}
            <button onClick={() => addField(section.id)} className="button add-element-button">
              + Dodaj {config.title.toLowerCase()}
            </button>
          </>
        ) : config.inputs?.[0]?.isArray ? (
          <>
            {renderInputs(section.id)}
            {getAtomByCategory(section.id)[0].length < (config.inputs[0].maxItems || Infinity) && (
              <button onClick={() => addField(section.id)} className="button add-element-button">
                + Dodaj {config.inputs[0].placeholderText.toLowerCase()}
              </button>
            )}
          </>
        ) : (
          renderInputs(section.id)
        )}
      </div>
    );
  };

  return (
    <div
      className={`section ${section.id}-section`}
      draggable={!section.isFixed}
      onDragStart={(e) => !section.isFixed && onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      onDragEnter={(e) => e.currentTarget.classList.add('dragging-over')}
      onDragLeave={(e) => e.currentTarget.classList.remove('dragging-over')}
    >
      <div className="section-header">
        {!section.isFixed && (
          <div className="drag-handle" title="Przeciągnij aby zmienić kolejność">
            <span>⋮⋮</span>
          </div>
        )}
        <h2>{sectionConfig[section.id]?.title || section.title}</h2>
        {!section.isFixed && (
          <div className="section-controls">
            <button
              onClick={() => onMove(index, 'up')}
              className="order-button"
              disabled={index === 0}
              title="Przesuń sekcję w górę"
            >
              <span className="arrow">↑</span>
            </button>
            <button
              onClick={() => onMove(index, 'down')}
              className="order-button"
              disabled={index === totalSections - 1}
              title="Przesuń sekcję w dół"
            >
              <span className="arrow">↓</span>
            </button>
          </div>
        )}
      </div>
      {renderSectionContent()}
    </div>
  );
};

export default CVisionSection;