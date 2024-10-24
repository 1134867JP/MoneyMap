const express = require('express');
const bodyParser = require('body-parser');
const { supabase } = require('./supabaseClient'); // Importar o cliente do Supabase

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
  const { email, password, username, fullName, birthdate, profileImage } = req.body;

  try {
    // Cria o usuário no Supabase
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error('Error creating user:', signUpError);
      return res.status(400).json({ error: signUpError.message });
    }

    const user = signUpData.user;

    if (!user) {
      console.error('User creation failed, no user returned');
      return res.status(400).json({ error: 'User creation failed' });
    }

    console.log('User created:', user);

    // Obtém o id do usuário criado
    const id = user.id;

    // Armazena informações adicionais na tabela 'profiles'
    const { data: profileData, error: insertError } = await supabase
      .from('profiles')
      .insert([
        { id, username, full_name: fullName, birthdate, profile_image: profileImage },
      ]);

    if (insertError) {
      console.error('Error inserting profile:', insertError);
      return res.status(400).json({ error: insertError.message });
    }

    console.log('Profile inserted:', profileData);
    res.status(200).json({ message: 'User created successfully', data: profileData });

  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});