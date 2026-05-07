document.getElementById('formUpload').addEventListener('submit', async (e) => {
  e.preventDefault();

  const archivo = document.getElementById('archivo').files[0];
  const formData = new FormData();
  formData.append('archivo', archivo);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log('Respuesta del servidor:', data);
  } catch (error) {
    console.error('Error al subir archivo:', error);
  }
});