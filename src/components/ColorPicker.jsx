import { useAtom } from 'jotai';
import { selectedColorAtom } from '../store/atoms';

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useAtom(selectedColorAtom);

  return (
    <div className="section color-picker-section">
      <h2>Wybór koloru</h2>
      <input
        type="color"
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="color-picker"
      />
    </div>
  );
};

export default ColorPicker;