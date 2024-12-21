document.getElementById("convertToPNG").addEventListener("click", () => convertImage("image/png"));
document.getElementById("convertToJPG").addEventListener("click", () => convertImage("image/jpeg"));
document.getElementById("convertToPDF").addEventListener("click", convertToPDF);

let imageData = null;

document.getElementById("uploadImage").addEventListener("change", handleImageUpload);

function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    showError("Only JPG and PNG files are supported.");
    return;
  }

  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      imageData = img;

      // Preview the uploaded image
      const previewImage = document.getElementById("previewImage");
      previewImage.src = img.src;
      previewImage.style.display = "block";
    };
    img.src = e.target.result;
  };
  
  reader.readAsDataURL(file);
}

function convertImage(format) {
  if (!imageData) {
    showError("Please upload an image first.");
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.drawImage(imageData, 0, 0);

  const dataUrl = canvas.toDataURL(format);
  const downloadLink = document.getElementById("downloadLink");
  downloadLink.href = dataUrl;
  downloadLink.download = `converted-image.${format === "image/png" ? "png" : "jpg"}`;
  downloadLink.style.display = "block";
}

function convertToPDF() {
  if (!imageData) {
    showError("Please upload an image first.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.drawImage(imageData, 0, 0);

  const imgData = canvas.toDataURL("image/jpeg");
  doc.addImage(imgData, 'JPEG', 10, 10, 180, 160);
  doc.save("image.pdf");
}

function showError(message) {
  const errorElement = document.getElementById("error-message");
  errorElement.textContent = message;
  setTimeout(() => errorElement.textContent = "", 3000);
}
