const axios = require('axios');

const uploadImage = async (username, profileImage) => {
  if (!profileImage) {
    return null;
  }

  const formData = new FormData();
  formData.append('file', profileImage.buffer, `${username}-${Date.now()}.jpg`);

  try {
    const response = await axios.post('http://192.168.1.32:3000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url;
  } catch (error) {
    throw new Error(`Error uploading image: ${error.message}`);
  }
};

const signUpUser = async (email, password, username, fullName, birthdate, profileImage) => {
  try {
    const response = await axios.post('http://192.168.1.32:3000/signup', {
      email,
      password,
      username,
      fullName,
      birthdate,
      profileImage,
    });

    return response.data;
  } catch (error) {
    throw new Error(`Error signing up: ${error.message}`);
  }
};

module.exports = { signUpUser, uploadImage };