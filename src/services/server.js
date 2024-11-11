const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const { signUpUser } = require('./UserService'); // Adjusted import

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

app.post('/signup', upload.single('profileImage'), async (req, res) => {
  const { email, password, username, fullName, birthdate } = req.body;
  const profileImage = req.file;

  if (!email || !password || !username || !fullName || !birthdate) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const signUpData = await signUpUser(email, password, username, fullName, birthdate, profileImage);

    res.status(200).json({ message: 'Usuário criado com sucesso', user: signUpData.user, profile: signUpData.profile });
  } catch (err) {
    console.error('Erro inesperado:', err);
    res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});