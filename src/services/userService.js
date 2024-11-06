const supabase = require('./supabaseClient');

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

  return signUpData;
};

module.exports = { signUpUser, uploadImage };