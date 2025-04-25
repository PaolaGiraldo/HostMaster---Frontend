import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

interface QuantityEditorProps {
  initialQuantity: number;
  onSave: (newQuantity: number) => void;
}

const QuantityEditor: React.FC<QuantityEditorProps> = ({
  initialQuantity,
  onSave,
}) => {
  const [value, setValue] = useState(initialQuantity);

  // Si cambian las props, sincronizamos
  useEffect(() => {
    setValue(initialQuantity);
  }, [initialQuantity]);

  const handleBlur = () => {
    const newQty = Number(value);
    if (!isNaN(newQty) && newQty !== initialQuantity) {
      onSave(newQty);
    }
  };

  return (
    <Form.Control
      type="number"
      value={value}
      min={0}
      onChange={(e) => setValue(Number(e.target.value))}
      onBlur={handleBlur}
    />
  );
};

export default QuantityEditor;
