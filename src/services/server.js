// server.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const supabase = require('./supabaseClient');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/signup', upload.single('profileImage'), async (req, res) => {
  const { email, password, username, fullName, birthdate } = req.body;
  const profileImage = req.file;

  if (!email || !password || !username || !fullName || !birthdate) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error('Erro ao criar usuário:', signUpError);
      return res.status(400).json({ error: signUpError.message });
    }

    const user = signUpData.user;

    if (!user) {
      console.error('Falha na criação do usuário, nenhum usuário retornado');
      return res.status(400).json({ error: 'Falha na criação do usuário' });
    }

    let imageUrl = null;

    if (profileImage) {
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, profileImage.buffer, {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        console.error('Erro ao fazer upload da imagem:', uploadError);
        return res.status(400).json({ error: uploadError.message });
      }

      imageUrl = `${supabase.storageUrl}/profile-images/${fileData.path}`;
    }

    const { error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          username,
          full_name: fullName,
          birthdate,
          profile_image: imageUrl,
        },
      ]);

    if (insertError) {
      console.error('Erro ao inserir perfil:', insertError);
      return res.status(400).json({ error: insertError.message });
    }

    console.log('Perfil inserido com sucesso');
    res.status(200).json({ message: 'Usuário criado com sucesso', user });
  } catch (err) {
    console.error('Erro inesperado:', err);
    res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});