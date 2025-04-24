import { useAtom } from 'jotai';
import './app.scss';
import CVisionSection from './components/CVisionSection';
import ProfileImage from './components/ProfileImage';
import ColorPicker from './components/ColorPicker';
import ProfileManagementPanel from './components/ProfileManagementPanel';
import { sectionsOrderAtom } from './store/atoms';

const App = () => {
  const [sections, setSections] = useAtom(sectionsOrderAtom);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const newSections = [...sections];
    const [movedSection] = newSections.splice(dragIndex, 1);
    newSections.splice(dropIndex, 0, movedSection);
    setSections(newSections);
  };

  const moveSection = (index, direction) => {
    const newSections = [...sections];
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === 'down' && index < sections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    setSections(newSections);
  };

  return (
    <div className="cv-builder bg-gray-800 text-white p-6">
      <h1 className="app-header text-2xl mb-4">CVision</h1>

      <ProfileManagementPanel />
      <ProfileImage />

      {sections.map((section, index) => (
        <CVisionSection
          key={section.id}
          section={section}
          index={index}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMove={moveSection}
        />
      ))}

      <ColorPicker />
    </div>
  );
};

export default App;