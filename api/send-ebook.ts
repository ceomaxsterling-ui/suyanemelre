import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const resendApiKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // 1. Verificação de credenciais fundamentais
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERRO: Variáveis de ambiente do Supabase não encontradas.');
    return res.status(500).json({ 
      error: 'Configuração ausente',
      details: 'SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas nesta branch/ambiente da Vercel.' 
    });
  }

  if (!resendApiKey) {
    console.error('❌ ERRO: Variável RESEND_API_KEY não encontrada.');
    return res.status(500).json({ error: 'Configuração do Resend ausente.' });
  }

  const resend = new Resend(resendApiKey);
  const supabase = createClient(supabaseUrl, supabaseKey);

  const {
    nome, email, whatsapp, objetivo,
    tempo_investimento, carteira_estruturada,
    incomodo_investimentos, investimento_ano, analise_inicial
  } = req.body;

  try {
    console.log(`[DEBUG] Iniciando processamento para: ${email}`);

    // 2. Salvar no Supabase (Obrigatório agora para dar 200)
    const { error: dbError } = await supabase
      .from('leads')
      .insert([
        {
          nome: nome || 'Não informado',
          email: email || 'Não informado',
          whatsapp: whatsapp || 'Não informado',
          objetivo: objetivo || 'Não informado',
          tempo_investimento: tempo_investimento || 'Não informado',
          carteira_estruturada: carteira_estruturada || 'Não informado',
          incomodo_investimentos: incomodo_investimentos || 'Não informado',
          investimento_ano: investimento_ano || 'Não informado',
          analise_inicial: analise_inicial || 'Não informado'
        }
      ]);

    if (dbError) {
      console.error('❌ ERRO SUPABASE:', dbError.message);
      return res.status(500).json({ 
        error: 'Erro ao salvar no banco de dados', 
        details: dbError.message 
      });
    }

    // 3. Enviar E-mail para o Cliente
    await resend.emails.send({
      from: 'Suyane Melre <contato@suyanemelre.com.br>',
      to: email,
      subject: '🎁 [ACESSO LIBERADO] Seus 3 E-books + Diagnóstico',
      html: `<h1>Olá ${nome}, diagnóstico recebido!</h1><p>Acesse aqui os e-books...</p>`, // Simplificando para o teste, user pode restaurar o HTML rico depois
    });

    // 4. Notificação interna
    await resend.emails.send({
      from: 'Sistema Leads <contato@suyanemelre.com.br>',
      to: 'contato@suyanemelre.com.br',
      subject: `🚀 NOVO LEAD: ${nome}`,
      html: `<p>Novo lead: ${nome} (${email})</p>`,
    });

    console.log('✅ Fluxo concluído com sucesso.');
    return res.status(200).json({ ok: true });

  } catch (error: any) {
    console.error('❌ ERRO GERAL:', error.message);
    return res.status(500).json({ error: 'Erro interno ao processar o formulário', details: error.message });
  }
}