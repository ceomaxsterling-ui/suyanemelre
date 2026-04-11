import { Resend } from 'resend';

// A Resend necessita da sua chave de API (vamos configurar no Vercel Dashboard)
const resend = new Resend(process.env.RESEND_API_KEY || '');

export default async function handler(req: any, res: any) {
  // Configuração para CORS (caso o vite tente acesso direto em dev, embora em prod não precise)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { nome, email } = req.body;

  if (!email || !nome) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }

  try {
    const data = await resend.emails.send({
      from: 'Suyane Melre <contato@suyanemelre.com.br>', // Altere para seu domínio verificado
      to: [email],
      bcc: ['contato@suyanemelre.com.br'], // Cópia oculta para você receber o lead
      subject: `📈 Relatório de Diagnóstico: ${nome}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1E293B; border: 1px solid #E2E8F0; padding: 30px; border-radius: 12px;">
          <h2 style="color: #091426; border-bottom: 2px solid #F1F5F9; padding-bottom: 10px;">Diagnóstico Finalizado!</h2>
          
          <p>Olá <strong>${nome}</strong>, aqui está o resumo das suas informações e o acesso ao seu material.</p>
          
          <div style="background: #F8FAFC; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; font-size: 16px; color: #475569;">📋 Resumo do seu Perfil:</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 8px;"><strong>Objetivo:</strong> ${req.body.objetivo}</li>
              <li style="margin-bottom: 8px;"><strong>Tempo de Investimento:</strong> ${req.body.tempo_investimento}</li>
              <li style="margin-bottom: 8px;"><strong>Desafio Atual:</strong> ${req.body.incomodo_investimentos}</li>
              <li style="margin-bottom: 8px;"><strong>Volume Anual:</strong> ${req.body.investimento_ano}</li>
              <li style="margin-bottom: 8px;"><strong>WhatsApp:</strong> ${req.body.whatsapp}</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 35px 0;">
            <p style="font-size: 14px; color: #64748B; margin-bottom: 15px;">Clique no botão abaixo para baixar seu guia:</p>
            <a href="https://SUA_URL_DO_EBOOK.pdf" style="background: #091426; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">BAIXAR MEU E-BOOK</a>
          </div>

          <p style="font-size: 13px; color: #94A3B8; text-align: center;">Válido para o perfil: ${req.body.analise_inicial === 'Sim' ? 'Interesse em Consultoria' : 'Apenas e-book'}</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Erro ao enviar email pelo Resend:', error);
    return res.status(500).json({ error: 'Erro ao enviar email', details: error });
  }
}
