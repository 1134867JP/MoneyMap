const { supabase } = require('./supabaseClient'); // Adjusted import

const uploadImage = async (userId, profileImage) => {
  if (!profileImage) {
    return null;
  }

  const fileName = `${userId}-${Date.now()}.jpg`;
  const fileBuffer = profileImage.buffer;

  const { data: fileData, error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(`profile-images/${fileName}`, fileBuffer, {
      upsert: false,
      contentType: 'image/jpeg',
    });

  if (uploadError) {
    throw new Error(`Error uploading image: ${uploadError.message}`);
  }

  console.log('File data:', fileData);
  return `${supabase.storageUrl}/profile-images/${fileName}`;
};

const signUpUser = async (email, password, username, fullName, birthdate, profileImage) => {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    throw new Error(`Error signing up: ${signUpError.message}`);
  }

  const userId = signUpData.user.id;

  let profileImageUrl = null;
  if (profileImage) {
    profileImageUrl = await uploadImage(userId, profileImage);
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

module.exports = { signUpUser, uploadImage };