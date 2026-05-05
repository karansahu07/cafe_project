// Centralized options for product forms

export const sizeOptions = [
  { label: "Small", value: "Small" },
  { label: "Medium", value: "Medium" },
  { label: "Large", value: "Large" },
];

export const colorOptions = [
  { label: "Red", value: "Red" },
  { label: "Green", value: "Green" },
  { label: "Blue", value: "Blue" },
];

export const typeOptions = [
  { label: "Size", value: "size" },
  { label: "Color", value: "color" },
  { label: "Custom", value: "custom" },
];

export const unitOptions = [
  { label: "Kilogram", value: "kg." }, 
  { label: "Grams", value: "grm." }, 
  { label: "Liter", value: "ltr." }, 
  { label: "Milliliter", value: "ml." },
  { label: "Pieces", value: "pcs." },
  { label: "Box", value: "box" },
  { label: "Pack", value: "pack" },
];

export const quantityOptions = {
  kg: [
    { label: "1", value: "1" },
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
  ],
  g: [
    { label: "100", value: "100" },
    { label: "250", value: "250" },
    { label: "500", value: "500" },
    { label: "1000", value: "1000" },
  ],
  l: [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "5", value: "5" },
  ],
  ml: [
    { label: "100", value: "100" },
    { label: "250", value: "250" },
    { label: "500", value: "500" },
    { label: "1000", value: "1000" },
  ],
  pcs: [
    { label: "1", value: "1" },
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
  ],
  box: [
    { label: "1", value: "1" },
    { label: "3", value: "3" },
    { label: "5", value: "5" },
    { label: "10", value: "10" },
  ],
  pack: [
    { label: "1", value: "1" },
    { label: "3", value: "3" },
    { label: "6", value: "6" },
    { label: "12", value: "12" },
  ]
};
