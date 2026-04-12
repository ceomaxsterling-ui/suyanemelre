import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { nome, email, objetivo, tempo_investimento, carteira_estruturada, incomodo_investimentos, investimento_ano, analise_inicial } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Suyane Melre <contato@suyanemelre.com.br>', // ✅ DOMÍNIO VERIFICADO NA RESEND
      to: email,
      subject: '📘 Seus 3 E-books Exclusivos + Diagnóstico',
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Olá, ${nome}! 👋</h2>
          <p>Obrigado por fazer seu diagnóstico financeiro.</p>
          
          <h3>📚 Seus e-books exclusivos:</h3>
          <ul>
            <li>📗 E-book 1 — [Título aqui]</li>
            <li>📘 E-book 2 — [Título aqui]</li>
            <li>📙 E-book 3 — [Título aqui]</li>
          </ul>
          
          <p>Em breve nossa equipe entrará em contato para agendar uma conversa sobre seus objetivos. 🚀</p>
          
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #64748b;">
            Este e-mail foi enviado automaticamente após preenchimento do diagnóstico em suyanemelre.com.br
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Email sent:', data);
    return res.status(200).json({ ok: true, emailId: data?.id });
    
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Falha ao enviar e-mail' });
  }
}