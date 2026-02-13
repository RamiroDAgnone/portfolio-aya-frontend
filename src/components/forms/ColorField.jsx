export default function ColorField({
  label,
  name,
  value,
  onChange,
  defaultColor = "#ffffff"
}) {
  const colorValue = value || defaultColor;

  return (
    <>
      <h3>{label}</h3>
      <div className="color-row">
        <label className="color-square">
          <input
            type="color"
            name={name}
            value={colorValue}
            onChange={onChange}
          />
        </label>
        <label className="color-hex">
          <input
            type="text"
            name={name}
            value={colorValue}
            onChange={onChange}
          />
        </label>
      </div>
    </>
  );
}