const nodemailer = require('nodemailer');
require('dotenv').config(); // Adicionando aqui também para garantir que as variáveis sejam carregadas

// Função para inicializar o transporter com credenciais
const initializeTransporter = async () => {
  // Verificar se as variáveis de ambiente estão definidas
  console.log('Verificando variáveis de ambiente:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Definido' : 'Não definido');
  console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? 'Definido' : 'Não definido');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.error('Erro: EMAIL_USER ou EMAIL_APP_PASSWORD não definidos no ambiente');
    throw new Error('Credenciais de email não configuradas');
  }

  // Configuração explícita do transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Especificando o host explicitamente
    port: 465,               // Porta segura para Gmail
    secure: true,            // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    debug: true              // Isso vai ajudar a diagnosticar problemas futuros
  });

  try {
    // Verifica a conexão com o servidor SMTP
    await transporter.verify();
    console.log('Conexão com o servidor SMTP estabelecida com sucesso');
    return transporter;
  } catch (error) {
    console.error('Erro ao conectar com o servidor SMTP:', error);
    throw error;
  }
};

const sendEncryptedMessage = async (recipientEmail, username, encryptedMessage, hash, baseUrl) => {
  // Inicializar o transporter para cada envio de email
  const transporter = await initializeTransporter();
  
  // Construindo a URL para descriptografar
  const decryptUrl = `${baseUrl}/decrypt`;
 
  const mailOptions = {
    from: `"Mensagem Segura" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: 'Você recebeu uma mensagem criptografada',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Mensagem Criptografada</h2>
        <p>Olá,</p>
        <p><strong>${username}</strong> te enviou uma mensagem criptografada:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; font-size: 16px; margin: 20px 0; font-family: monospace;">
          ${encryptedMessage}
        </div>
        <p style="margin-top: 20px;">Para descriptografar esta mensagem use o seguinte código: ${hash} no link abaixo</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${decryptUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Descriptografar Mensagem
          </a>
        </div>
        <p>Ou copie e cole o link abaixo em seu navegador:</p>
        <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">
          ${decryptUrl}
        </div>
        <p style="margin-top: 30px; color: #777; font-size: 12px; text-align: center;">
          Este é um email automático, por favor não responda.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email com mensagem criptografada enviado com sucesso:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
};

module.exports = {
  sendEncryptedMessage
};