const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');

const generateToken = (userId) => {
  return jwt.sign({ userId }, { expiresIn: '30min' });
};

const authService = {
  signup: async (userData) => {
    // Validação básica dos dados
    if (!userData.nome || !userData.email || !userData.senha) {
      throw new Error('Nome, email e senha são obrigatórios.');
    }

    // Verificar se o usuário já existe com o mesmo email
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('E-mail já existente.');
    }

    // Criptografar a senha antes de salvar no banco de dados
    const hashedPassword = await bcrypt.hash(userData.senha, 10);

    // Criar usuário no banco de dados
    const newUser = await User.create({
      nome: userData.nome,
      email: userData.email,
      senha: hashedPassword,
    });

    return newUser;
  },

  signin: async (credentials) => {
    const { email, senha } = credentials;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas.');
    }

    // Gerar token JWT
    const token = generateToken(user.id);

    return token;
  },
};

module.exports = authService;
