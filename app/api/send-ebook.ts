import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Inicializa Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Inicializa Supabase (SERVER-SIDE - usa service_role se disponível)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { nome, email, whatsapp, objetivo, tempo_investimento, carteira_estruturada, incomodo_investimentos, investimento_ano, analise_inicial } = req.body;

  try {
    // 🔹 1. SALVAR NO SUPABASE (antes de enviar o e-mail)
    const { error: dbError } = await supabase
      .from('leads')
      .insert({
        nome,
        email,
        whatsapp,
        objetivo,
        tempo_investimento,
        carteira_estruturada,
        incomodo_investimentos,
        investimento_ano,
        analise_inicial,
        criado_em: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Supabase error:', dbError);
      // Continua mesmo se falhar (não bloqueia o e-mail)
    }

    // 🔹 2. ENVIAR E-MAIL VIA RESEND (código original)
    const { data, error: emailError } = await resend.emails.send({
      from: 'Suyane Melre <contato@suyanemelre.com.br>',
      to: email,
      bcc: 'saviomaxwell088@gmail.com',
      subject: '🎁 [ACESSO LIBERADO] Seus 3 E-books + Diagnóstico',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1E293B; background-color: #ffffff; padding: 40px; border: 1px solid #E2E8F0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #091426; margin: 0; font-size: 24px; letter-spacing: -0.5px;">Diagnóstico Concluído 🎉</h1>
            <p style="color: #64748B; font-size: 16px; margin-top: 8px;">Aqui está o seu presente especial!</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">Olá <strong>${nome}</strong>, obrigado por realizar o nosso diagnóstico! Como prometido, já liberei o seu acesso aos nossos 3 e-books exclusivos de inteligência financeira.</p>
          
          <div style="background-color: #F8FAFC; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #091426;">
            <h3 style="margin-top: 0; font-size: 18px; color: #091426;">📚 Seus materiais liberados:</h3>
            <ul style="color: #475569; font-size: 15px; margin-bottom: 20px; line-height: 1.8;">
              <li><strong>E-book 01</strong>: Efeito Manada</li>
              <li><strong>E-book 02</strong>: Os 5 erros silenciosos que podem estar travando sua carteira de investimentos</li>
              <li><strong>E-book 03</strong>: Consultoria para a Vida</li>
            </ul>
            <p style="color: #475569; font-size: 14px; margin-bottom: 20px;"><em>Basta clicar no botão abaixo para acessar sua pasta exclusiva contendo todos os arquivos!</em></p>
            
            <div style="text-align: center;">
              <a href="https://drive.google.com/drive/u/4/folders/1ChGxEAHAuJEHJdw6vGeIvq6Cn_OvmQnZ" target="_blank" style="display: inline-block; background-color: #091426; color: #ffffff; text-decoration: none; font-weight: bold; padding: 16px 32px; border-radius: 8px; font-size: 16px;">
                📥 ACESSAR PASTA COM OS E-BOOKS
              </a>
            </div>
          </div>
          
          <p style="font-size: 16px; font-weight: bold; color: #091426; margin-top: 30px;">Abs,<br>Suyane Melre</p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return res.status(500).json({ error: emailError.message });
    }

    console.log('Email sent:', data);
    return res.status(200).json({ ok: true, emailId: data?.id });
    
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Falha ao processar solicitação' });
  }
}