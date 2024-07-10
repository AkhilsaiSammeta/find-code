const imageInput = document.getElementById('image-input');
const findBtn = document.getElementById('find-btn');
const colorCodesDiv = document.getElementById('color-codes');

findBtn.addEventListener('click', findColors);

function findColors() {
  const file = imageInput.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
    const imageData = event.target.result;
    const image = new Image();
    image.src = imageData;
    image.onload = function() {
      if (image.complete) {
        const colors = getColorsFromImage(image);
        displayColorCodes(colors);
      } else {
        alert("Image not fully loaded");
      }
    };
  };
  reader.onerror = function(event) {
    alert("Error reading file: " + event.target.error);
  };
  reader.readAsDataURL(file);
}

function getColorsFromImage(image) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const colors = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const color = `RGB(${r}, ${g}, ${b})`;
    colors.push(color);
  }
  return colors;
}

function displayColorCodes(colors) {
  colorCodesDiv.innerHTML = '';
  colors.forEach((color) => {
    const colorCodeDiv = document.createElement('div');
    colorCodeDiv.className = 'color-code';
    const span = document.createElement('span');
    span.textContent = color;
    const rgb = color.replace('RGB(', '').replace(')', '').split(',').map((x) => parseInt(x));
    colorCodeDiv.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    span.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    colorCodeDiv.appendChild(span);
    colorCodeDiv.addEventListener('click', () => {
      navigator.clipboard.writeText(color);
      alert(`Copied to clipboard: ${color}`);
    });
    colorCodesDiv.appendChild(colorCodeDiv);
  });
}
