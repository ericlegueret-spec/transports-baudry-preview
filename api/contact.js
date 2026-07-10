// api/contact.js — Vercel Serverless Function
// Credentials uniquement via variables d'environnement — jamais hardcodes.

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Variables GMAIL_USER / GMAIL_APP_PASSWORD manquantes');
    return res.status(500).json({ error: 'Configuration serveur incomplete' });
  }
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
    const { societe, nom, telephone, frequence, marchandise, message } = req.body || {};
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: process.env.GMAIL_USER,
      subject: 'Nouvelle demande — Transports Baudry',
      text:
        'Societe : ' + (societe || '-') + '\n' +
        'Nom : ' + (nom || '-') + '\n' +
        'Telephone : ' + (telephone || '-') + '\n' +
        'Frequence : ' + (frequence || '-') + '\n' +
        'Type de matiere : ' + (marchandise || '-') + '\n\n' +
        'Message :\n' + (message || '-') + '\n'
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur envoi mail:', err);
    return res.status(500).json({ error: "Echec de l'envoi" });
  }
};
