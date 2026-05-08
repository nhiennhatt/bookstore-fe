const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);
  
  const generateSolidColorSvg = (color: string) => `
    <svg width="1" height="1" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect width="1" height="1" fill="${color}" />
    </svg>`;
  
  export const getImagePlaceholder = (color: string) => 
    `data:image/svg+xml;base64,${toBase64(generateSolidColorSvg(color))}`;