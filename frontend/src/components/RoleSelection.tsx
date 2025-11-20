import React from 'react';

interface RoleSelectionProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  onStartInterview: () => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({
  selectedRole,
  onRoleChange,
  onStartInterview,
}) => {
  // Available job roles
  const roles = [
    'Backend Developer',
    'Frontend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Data Scientist',
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AI Interview Prep</h1>
      <p style={styles.subtitle}>Select your role to begin practicing</p>

      <div style={styles.formGroup}>
        <label htmlFor="roleSelect" style={styles.label}>
          Choose Your Role:
        </label>
        <select
          id="roleSelect"
          value={selectedRole}
          onChange={(e) => onRoleChange(e.target.value)}
          style={styles.select}
        >
          <option value="">-- Select a role --</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onStartInterview}
        disabled={!selectedRole}
        style={{
          ...styles.button,
          opacity: selectedRole ? 1 : 0.5,
          cursor: selectedRole ? 'pointer' : 'not-allowed',
        }}
      >
        Start Interview
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '40px',
    textAlign: 'center' as const,
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
  },
  formGroup: {
    marginBottom: '30px',
    textAlign: 'left' as const,
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: '10px',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
  },
  button: {
    padding: '12px 30px',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
};

export default RoleSelection;