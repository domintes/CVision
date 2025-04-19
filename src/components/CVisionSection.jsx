import { useAtom } from 'jotai';
import {
  personalInfoAtom,
  skillsAtom,
  interestsAtom,
  educationAtom,
  experienceAtom,
  customCategoriesAtom
} from '../store/atoms';
import { sectionConfig } from '../data/sectionConfig';

const CVisionSection = ({ 
  section, 
  index, 
  onDragStart, 
  onDragOver, 
  onDrop, 
  onMove 
}) => {
  const [personalInfo, setPersonalInfo] = useAtom(personalInfoAtom);
  const [skills, setSkills] = useAtom(skillsAtom);
  const [interests, setInterests] = useAtom(interestsAtom);
  const [education, setEducation] = useAtom(educationAtom);
  const [experience, setExperience] = useAtom(experienceAtom);
  const [customCategories, setCustomCategories] = useAtom(customCategoriesAtom);

  const handleInputChange = (e, field, index, category) => {
    const value = e.target.value;
    const element = e.target;
    
    switch(category) {
      case 'personalInfo':
        setPersonalInfo(prev => ({ ...prev, [field]: value }));
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
        break;
      default:
        break;
    }

    // Ensure focus is maintained after state update
    requestAnimationFrame(() => {
      if (document.activeElement !== element) {
        element.focus();
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
      case 'education':
        return [education, setEducation];
      case 'experience':
        return [experience, setExperience];
      case 'custom':
        return [customCategories, setCustomCategories];
      default:
        return [null, () => {}];
    }
  };

  const renderInputs = (sectionId, itemIndex = 0) => {
    const config = sectionConfig[sectionId];
    if (!config) return null;

    const [values] = getAtomByCategory(sectionId);
    
    return config.inputs?.map((input, inputIndex) => {
      if (sectionId === 'personalInfo') {
        const InputComponent = input.type === 'textarea' ? 'textarea' : 'input';
        return (
          <InputComponent
            key={input.name}
            type={input.type}
            placeholder={input.placeholderText}
            value={values[input.name] || ''}
            onChange={(e) => handleInputChange(e, input.name, null, sectionId)}
            className={input.type === 'textarea' ? 'textarea' : 'input'}
          />
        );
      } else if (config.isArray && !input.isArray) {
        return (
          <input
            key={`${input.name}-${itemIndex}`}
            type={input.type}
            placeholder={input.placeholderText}
            value={values[itemIndex]?.[input.name] || ''}
            onChange={(e) => handleInputChange(e, input.name, itemIndex, sectionId)}
            className="input"
          />
        );
      } else if (input.isArray) {
        return (
          <ul key={`${sectionId}-list-${inputIndex}`} className="input-list">
            {values.map((value, idx) => (
              <li key={`${sectionId}-${input.name}-${idx}`}>
                <input
                  type={input.type}
                  placeholder={input.placeholderText}
                  value={value || ''}
                  onChange={(e) => handleInputChange(e, null, idx, sectionId)}
                  className="input"
                />
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

    if (section.id === 'custom') {
      return (
        <div className="section-content custom-section">
          {customCategories.map((category, idx) => (
            <div key={idx} className="custom-category">
              <input
                type="text"
                placeholder="Nazwa kategorii"
                value={category.name}
                onChange={(e) => {
                  const updated = [...customCategories];
                  updated[idx].name = e.target.value;
                  setCustomCategories(updated);
                }}
                className="input"
              />
              {category.items.map((item, itemIndex) => (
                <input
                  key={itemIndex}
                  type="text"
                  placeholder={`Element ${itemIndex + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...customCategories];
                    updated[idx].items[itemIndex] = e.target.value;
                    setCustomCategories(updated);
                  }}
                  className="input"
                />
              ))}
              {category.items.length < 10 && (
                <button 
                  onClick={() => {
                    const updated = [...customCategories];
                    updated[idx].items.push('');
                    setCustomCategories(updated);
                  }} 
                  className="button add-element-button"
                >
                  + Dodaj element
                </button>
              )}
            </div>
          ))}
          <button onClick={() => setCustomCategories([...customCategories, { name: '', items: [''] }])} className="button">
            + Dodaj kategorię niestandardową
          </button>
        </div>
      );
    }

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
      draggable={true}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      onDragEnter={(e) => e.currentTarget.classList.add('dragging-over')}
      onDragLeave={(e) => e.currentTarget.classList.remove('dragging-over')}
    >
      <div className="section-header">
        <div className="drag-handle" title="Przeciągnij aby zmienić kolejność">
          <span>⋮⋮</span>
        </div>
        <h2>{sectionConfig[section.id]?.title || section.title}</h2>
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
            disabled={index === section.length - 1}
            title="Przesuń sekcję w dół"
          >
            <span className="arrow">↓</span>
          </button>
        </div>
      </div>
      {renderSectionContent()}
    </div>
  );
};

export default CVisionSection;