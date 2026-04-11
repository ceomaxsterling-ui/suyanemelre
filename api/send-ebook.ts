import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { nome, email } = req.body;

  try {
    await resend.emails.send({
      from: 'Suyane Melre <contato@suyanemelre.com.br>',
      to: email,
      subject: '📘 Seus 3 E-books Exclusivos + Diagnóstico',
      html: `
        <h2>Olá, ${nome}! 👋</h2>
        <p>Obrigado por fazer seu diagnóstico financeiro.</p>
        <p>Aqui estão seus <strong>3 e-books exclusivos</strong>:</p>
        <ul>
          <li><a href="https://suyanemelre.com.br/ebooks/ebook1.pdf">📗 E-book 1 — Título aqui</a></li>
          <li><a href="https://suyanemelre.com.br/ebooks/ebook2.pdf">📘 E-book 2 — Título aqui</a></li>
          <li><a href="https://suyanemelre.com.br/ebooks/ebook3.pdf">📙 E-book 3 — Título aqui</a></li>
        </ul>
        <p>Em breve nossa equipe entrará em contato. 🚀</p>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Falha ao enviar e-mail' });
  }
}