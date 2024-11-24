const { supabase } = require('./supabaseClient'); // Adjusted import

const uploadImage = async (username, profileImage) => {
  if (!profileImage) {
    return null;
  }

  const fileName = `${username}-${Date.now()}.jpg`;
  const { data: fileData, error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(`profile-images/${fileName}`, profileImage, {
      upsert: false,
      contentType: profileImage.type,
    });

  if (uploadError) {
    throw new Error(`Error uploading image: ${uploadError.message}`);
  }

  return `${supabase.storageUrl}/object/public/${fileData.fullPath}`;
};

const signUpUser = async (email, password, username, fullName, birthdate, profileImage) => {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    if (signUpError.message === 'User already registered') {
      return { error: 'Usuário já registrado. Por favor, faça login.' };
    }
    throw new Error(`Error signing up: ${signUpError.message}`);
  }

  const userId = signUpData.user.id;

  if (!userId) {
    throw new Error('User ID is null');
  }

  let profileImageUrl = null;
  if (profileImage) {
    profileImageUrl = await uploadImage(username, profileImage);
  }

  const { error: insertError } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        username,
        full_name: fullName,
        birthdate: new Date(birthdate.split('/').reverse().join('-')).toISOString().split('T')[0],
        profile_image: profileImageUrl,
      },
    ]);

  if (insertError) {
    throw new Error(`Error inserting profile: ${insertError.message}`);
  }

  const { data: profileData, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (fetchError) {
    throw new Error(`Error fetching profile: ${fetchError.message}`);
  }

  return { user: signUpData.user, profile: profileData };
};

const fetchIncomes = async (userId) => {
  if (!userId) {
    throw new Error('User ID is null');
  }

  const { data, error } = await supabase
    .from('incomes')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Error fetching incomes: ${error.message}`);
  }

  return data;
};

const fetchExpenses = async (userId) => {
  if (!userId) {
    throw new Error('User ID is null');
  }

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Error fetching expenses: ${error.message}`);
  }

  return data;
};

module.exports = { signUpUser, uploadImage, fetchIncomes, fetchExpenses };