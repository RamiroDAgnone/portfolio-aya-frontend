export function getScrapDecoration(decorationsData, decorationsRefs, type) {
    if (!Array.isArray(decorationsRefs)) return null;

    const ref = decorationsRefs.find(d => d.type === type);
    if (!ref) return null;

    const full = decorationsData.find(d => d.name === type);
    if (!full) return null;

    const variationClass = `scrap-${type}-${ref.variation}`;

    const colorClass = `scrap-${type}-${ref.color}`;

    const colorObj = full.colors?.find(c => c.colorName === ref.color);
    
    const light = colorObj.colors.light;
    const dark = colorObj.colors.dark;

  return {
    className: `${variationClass} ${colorClass}`,
    style: {
        "--color-light":
            type === "tape" ? `${light}D9` : light,
        "--color-dark": 
            type === "tape" ? `${dark}F2` : dark,
    }
  };
}