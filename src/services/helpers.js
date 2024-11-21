import { supabase } from '../services/supabaseClient';

export const validateForm = ({ username, fullName, email, password, confirmPassword, birthdate }) => {
  let valid = true;
  const errors = {};

  if (!username) {
    errors.usernameError = 'Nome de usuário é obrigatório.';
    valid = false;
  } else {
    errors.usernameError = '';
  }

  if (!fullName) {
    errors.fullNameError = 'Nome completo é obrigatório.';
    valid = false;
  } else {
    errors.fullNameError = '';
  }

  if (!email) {
    errors.emailError = 'Email é obrigatório.';
    valid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.emailError = 'Email inválido.';
    valid = false;
  } else {
    errors.emailError = '';
  }

  if (!password) {
    errors.passwordError = 'Senha é obrigatória.';
    valid = false;
  } else if (password.length < 6) {
    errors.passwordError = 'A senha deve ter pelo menos 6 caracteres.';
    valid = false;
  } else {
    errors.passwordError = '';
  }

  if (!confirmPassword) {
    errors.confirmPasswordError = 'Confirmação de senha é obrigatória.';
    valid = false;
  } else if (password !== confirmPassword) {
    errors.confirmPasswordError = 'As senhas não coincidem.';
    valid = false;
  } else {
    errors.confirmPasswordError = '';
  }

  return { valid, errors };
};

export const uploadImage = async (profileImage, username) => {
  if (profileImage && profileImage.uri) {
    const fileExt = profileImage.uri.split('.').pop();
    const fileName = `${username}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, {
        uri: profileImage.uri,
        type: `image/${fileExt}`,
        name: fileName,
      });

    if (error) {
      throw error;
    }

    return `${supabase.storageUrl}/profile-images/${fileName}`;
  }
  return null;
};