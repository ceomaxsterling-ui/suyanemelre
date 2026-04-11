import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export default async function handler(req: any, res: any) {
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
      from: 'Suyane Melre <onboarding@resend.dev>', // Usando remetente padrão do Resend para seu teste funcionar agora sem configuração de domínio
      to: [email], // E-mail da pessoa que se cadastrou no site
      replyTo: 'saviomaxwell088@gmail.com', // Respostas vão para o seu e-mail pessoal
      bcc: ['saviomaxwell088@gmail.com'], // Você recebe uma cópia de todos os dados do lead
      subject: `📊 Diagnóstico Concluído + Seus Materiais, ${nome}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1E293B; border: 1px solid #E2E8F0; padding: 40px; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #091426; margin-top: 0; border-bottom: 2px solid #F1F5F9; padding-bottom: 15px;">Olá, ${nome}! 🎉</h2>
          
          <p style="font-size: 16px; line-height: 1.6;">Obrigada por confiar no meu trabalho e realizar o seu diagnóstico financeiro completo.</p>
          
          <div style="background: #F8FAFC; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #E2E8F0;">
            <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #475569;">📋 Dados do seu Diagnóstico:</h3>
            <p style="margin: 10px 0; font-size: 15px;"><strong>Objetivo:</strong> ${req.body.objetivo || 'Não informado'}</p>
            <p style="margin: 10px 0; font-size: 15px;"><strong>Experiência:</strong> ${req.body.tempo_investimento || 'Não informado'}</p>
            <p style="margin: 10px 0; font-size: 15px;"><strong>Desafio:</strong> ${req.body.incomodo_investimentos || 'Não informado'}</p>
            <p style="margin: 10px 0; font-size: 15px;"><strong>Whatsapp:</strong> ${req.body.whatsapp || 'Não informado'}</p>
          </div>

          <h3 style="color: #091426; font-size: 18px;">🎁 Seus Materiais Exclusivos:</h3>
          <p style="font-size: 14px; color: #64748B;">Clique nos links abaixo para acessar os e-books:</p>
          
          <div style="margin: 20px 0;">
            <a href="https://SUA_URL_AQUI/ebook-1.pdf" style="display: block; margin-bottom: 10px; color: #091426; font-weight: bold; text-decoration: none;">📘 1. Guia de Consultoria Financeira</a>
            <a href="https://SUA_URL_AQUI/ebook-2.pdf" style="display: block; margin-bottom: 10px; color: #091426; font-weight: bold; text-decoration: none;">📗 2. Superando o Efeito Manada</a>
            <a href="https://SUA_URL_AQUI/ebook-3.pdf" style="display: block; color: #091426; font-weight: bold; text-decoration: none;">📕 3. Os 5 Erros que Travam seu Patrimônio</a>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #F1F5F9;">
            <p style="font-size: 14px; color: #64748B;">Em breve entraremos em contato para os próximos passos!</p>
            <p style="font-size: 16px; font-weight: bold; color: #091426;">Suyane Melre</p>
          </div>
        </div>
      `
    });

    return res.status(200).json({ success: true, id: data.id });
  } catch (error: any) {
    console.error('Erro Resend:', error);
    return res.status(500).json({ error: 'Erro ao enviar e-mail', details: error.message });
  }
}
