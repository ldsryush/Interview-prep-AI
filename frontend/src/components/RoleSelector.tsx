import React from 'react';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  disabled: boolean;
}

const ROLES = [
  'Software Engineer',
  'Data Scientist',
  'Product Manager',
  'Frontend Developer',
];

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleChange, disabled }) => {
  return (
    <div className="role-selector">
      <label htmlFor="role-select">Select Interview Role:</label>
      <select
        id="role-select"
        value={selectedRole}
        onChange={(e) => onRoleChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">Choose a role...</option>
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoleSelector;
