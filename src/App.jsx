import { useAtom } from 'jotai';
import './app.scss';
import CVisionSection from './components/CVisionSection';
import ProfileImage from './components/ProfileImage';
import ColorPicker from './components/ColorPicker';
import ProfileManagementPanel from './components/ProfileManagementPanel';
import { leftSectionsOrderAtom, rightSectionsOrderAtom } from './store/atoms';

const App = () => {
  const [leftSections, setLeftSections] = useAtom(leftSectionsOrderAtom);
  const [rightSections, setRightSections] = useAtom(rightSectionsOrderAtom);

  const handleDragStart = (e, index, section) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ index, section }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex, targetSection) => {
    e.preventDefault();
    const { index: dragIndex, section: sourceSection } = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Only allow reordering within the same section
    if (sourceSection !== targetSection) return;

    if (dragIndex === dropIndex) return;

    if (targetSection === 'left') {
      const newSections = [...leftSections];
      const [movedSection] = newSections.splice(dragIndex, 1);
      newSections.splice(dropIndex, 0, movedSection);
      setLeftSections(newSections);
    } else {
      const newSections = [...rightSections];
      const [movedSection] = newSections.splice(dragIndex, 1);
      newSections.splice(dropIndex, 0, movedSection);
      setRightSections(newSections);
    }
  };

  const moveSection = (index, direction, section) => {
    if (section === 'left') {
      const newSections = [...leftSections];
      if (direction === 'up' && index > 0) {
        [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
      } else if (direction === 'down' && index < leftSections.length - 1) {
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      }
      setLeftSections(newSections);
    } else {
      const newSections = [...rightSections];
      if (direction === 'up' && index > 0) {
        [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
      } else if (direction === 'down' && index < rightSections.length - 1) {
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      }
      setRightSections(newSections);
    }
  };

  return (
    <div className="cv-builder bg-gray-800 text-white p-6">
      <h1 className="app-header text-2xl mb-4">CVision</h1>
      <ProfileManagementPanel />
      <div className="sections-container">
        <div className="left-sections">
          <h2 className="section-header">Lewa sekcja</h2>
          <div className="section profileImage-section" draggable="false">
            <div className="section-header"><h2>Zdjęcie</h2></div>
            <div className="section-content profileImage-section">
              <ProfileImage />
            </div>
          </div>
          {leftSections.map((section, index) => (
            <CVisionSection
              key={section.id}
              section={section}
              index={index}
              sectionType="left"
              onDragStart={(e) => handleDragStart(e, index, 'left')}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index, 'left')}
              onMove={(index, direction) => moveSection(index, direction, 'left')}
              totalSections={leftSections.length}
            />
          ))}
        </div>

        <div className="right-sections">
          <h2 className="section-header">Prawa sekcja</h2>
          {rightSections.map((section, index) => (
            <CVisionSection
              key={section.id}
              section={section}
              index={index}
              sectionType="right"
              onDragStart={(e) => handleDragStart(e, index, 'right')}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index, 'right')}
              onMove={(index, direction) => moveSection(index, direction, 'right')}
            />
          ))}
        </div>
      </div>

      <ColorPicker />
    </div>
  );
};

export default App;