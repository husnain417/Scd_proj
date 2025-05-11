import React from 'react';
import './InputWithIcon.css';

const InputWithIcon = ({ iconClass, placeholder, value, onChange, required, inputClass }) => {
  return (
    <div className={`input-container ${inputClass}`}>
      <i className={iconClass}></i>
      <input 
        type="text" 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        required={required}
      />
    </div>
  );
};

export default InputWithIcon;
