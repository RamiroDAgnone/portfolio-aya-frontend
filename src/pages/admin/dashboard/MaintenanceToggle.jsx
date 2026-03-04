export default function MaintenanceToggle({
  value = false,
  onChange = () => {},
  disabled = false
}) {
  return (
    <label
      className="maintenance-toggle"
      style={{
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer"
      }}
    >
      <span>Modo mantenimiento</span>

      <input
        type="checkbox"
        checked={value}
        disabled={disabled}
        onChange={e => onChange(e.target.checked)}
      />
    </label>
  );
}