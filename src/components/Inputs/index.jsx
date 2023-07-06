import React from 'react';

const TextInput = ({ label, id, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input type="text" id={id} value={value} onChange={onChange} />
    </div>
  );
};

const PasswordInput = ({ label, id, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input type="password" id={id} value={value} onChange={onChange} />
    </div>
  );
};

export { TextInput, PasswordInput };
