import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const fallbackWords = [
  { word: 'follow up on', ipa: '/ˈfɑːloʊ ʌp ɑːn/', type: 'phrasal verb', meaningKo: '진행 상황을 확인하다', example: 'I will follow up on the quotation tomorrow.', exampleKo: '내일 견적 건을 다시 확인하겠습니다.', memoryTipKo: '특정 사안을 끝까지 따라가며 확인하는 느낌입니다.', usageKo: 'follow up on + 사안 / follow up with + 사람' },
  { word: 'proceed with', ipa: '/proʊˈsiːd wɪð/', type: 'phrasal verb', meaningKo: '~을 진행하다', example: 'We can proceed with production after drawing approval.', exampleKo: '도면 승인 후 생산을 진행할 수 있습니다.', memoryTipKo: '앞으로 나아가며 진행하는 느낌입니다.', usageKo: 'proceed with production/order/shipment 형태로 자주 씁니다.' },
  { word: 'lead time', ipa: '/ˈliːd taɪm/', type: 'noun', meaningKo: '제작/납기 소요 기간', example: 'The lead time is around 40 to 50 days after approval.', exampleKo: '승인 후 리드타임은 약 40~50일입니다.', memoryTipKo: '납기 문의에서 자주 쓰는 핵심 표현입니다.', usageKo: 'lead time after approval, lead time for production' }
];

function safeJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found');
  return JSON.parse(text.slice(start, end + 1));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category = 'mixed', date, recentWords = [] } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({ source: 'fallback-no-api-key', words: fallbackWords });
    }

    const prompt = `
You are an English vocabulary coach for a Korean overseas sales professional.
Generate exactly 3 useful English vocabulary flashcards for date: ${date || 'today'}.
Category: ${category}.
Rules:
- Include 1 or 2 phrasal verbs.
- Avoid these recently studied words unless unavoidable: ${recentWords.slice(-180).join(', ')}.
- Prefer practical business, overseas sales, quotation, delivery, shipment, payment, inspection, exhibition, and daily conversation words.
- Do not choose obscure academic words.
- Each example must be natural and useful in real work or daily conversation.
- Return JSON only, no markdown.
Schema:
{
  "words": [
    {
      "word": "string",
      "ipa": "IPA pronunciation",
      "type": "phrasal verb | noun | verb | adjective | expression",
      "meaningKo": "Korean meaning",
      "example": "English example sentence",
      "exampleKo": "Korean translation",
      "memoryTipKo": "short Korean memory/etymology/association tip",
      "usageKo": "Korean practical usage note, especially preposition/pattern differences when helpful"
    }
  ]
}`;

    const response = await client.responses.create({
      model: 'gpt-5.4-mini',
      input: prompt
    });

    const parsed = safeJson(response.output_text || '');
    if (!parsed.words || !Array.isArray(parsed.words) || parsed.words.length !== 3) {
      throw new Error('Invalid word count');
    }

    return res.status(200).json({ source: 'openai', words: parsed.words });
  } catch (error) {
    console.error(error);
    return res.status(200).json({ source: 'fallback-error', words: fallbackWords, warning: String(error.message || error) });
  }
}
