import { GoogleGenAI, Type } from "@google/genai";
import { formatCurrency } from "./gameLogic";
import { STATIC_CHALLENGES, CHALLENGE_CATEGORIES, STATIC_INCENTIVES } from "./challengesData";
import { AiIncentive, AiChallenge, AiPrediction } from "./aiTypes";

const AI_SYSTEM_INSTRUCTION = `
  Você é o Oráculo Financeiro do Bingo2Gether, uma IA de elite especializada em finanças e conexão para casais.
  
  SEUS PRINCÍPIOS:
  1. **Variedade é Chave**: O casal precisa de novidade. Alterne entre desafios físicos, mentais, de sorte e criativos.
  2. **Inteligência Real**: Nada de dicas genéricas. Dê estratégias de alto nível.
  3. **Conexão**: Os desafios devem unir o casal, fazer rir ou gerar intimidade.
  4. **Prendas Construtivas**: Puna o perdedor com tarefas de serviço (massagem, limpeza, organização) ou afeto, nunca humilhação.
`;

const getAiClient = () => {
  // Use Vite environment variable
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("Gemini API Key is missing (VITE_GEMINI_API_KEY). Using fallback mode.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};


export const getIncentive = async (
  p1Name: string,
  p2Name: string,
  contextData: {
    totalGoal: number,
    deadlineMonths: number,
    totalNumbers: number,
    avgValue: number,
    progressPercent: number,
    remainingNumbers: number,
    objective: string
  },
  recentTitles: string[] = [] // New parameter for anti-repetition
): Promise<AiIncentive> => {
  const ai = getAiClient();

  // Filter fallbacks to exclude recent titles
  const availableFallbacks = STATIC_INCENTIVES.filter(i => !recentTitles.includes(i.title));
  // If we exhausted all fallbacks, reset
  const pool = availableFallbacks.length > 0 ? availableFallbacks : STATIC_INCENTIVES;
  const fallback = pool[Math.floor(Math.random() * pool.length)];

  if (!ai) return fallback;

  const contextPrompt = `
    DADOS DE CONTEXTO:
    - Valor total da meta: ${formatCurrency(contextData.totalGoal)}
    - Prazo da meta: ${contextData.deadlineMonths} meses
    - Percentual já alcançado: ${contextData.progressPercent.toFixed(1)}%
    
    ### RESTRIÇÕES (Anti-Repetição):
    NÃO gere dicas com os seguintes títulos: 
    ${JSON.stringify(recentTitles.slice(-5))}

    Gere uma DICA FINANCEIRA DE ELITE (Smart/High IQ).
    
    Pode ser sobre:
    1. **Investimentos**: Juros compostos, CDB, LCI, liquidez.
    2. **Psicologia Econômica**: Viés do presente, contabilidade mental.
    3. **Hacks de Economia**: Negociação, análise de custo-benefício, minimalismo.
    
    Seja curto, direto e motivador. Responda em JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: contextPrompt,
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        temperature: 0.9, // Higher for variety
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título impactante" },
            practicalTip: { type: Type.STRING, description: "Dica acionável e inteligente (Max 2 frases)" },
            bingoImpact: { type: Type.STRING, description: "Impacto quantitativo no jogo" },
            timeImpact: { type: Type.STRING, description: "Quanto tempo isso economiza" }
          },
          required: ["title", "practicalTip", "bingoImpact", "timeImpact"]
        }
      }
    });

    const text = response.text;
    if (!text) return fallback;
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Incentive Error:", error);
    return fallback;
  }
};

export const getChallenge = async (
  p1Name: string,
  p2Name: string,
  recentTitles: string[] = [] // New parameter for anti-repetition
): Promise<AiChallenge> => {
  const ai = getAiClient();

  // Filter fallbacks to exclude recent titles
  const availableFallbacks = STATIC_CHALLENGES.filter(c => !recentTitles.includes(c.title));
  // If we exhausted all fallbacks (rare), reset
  const pool = availableFallbacks.length > 0 ? availableFallbacks : STATIC_CHALLENGES;

  const fallback = pool[Math.floor(Math.random() * pool.length)];

  if (!ai) return fallback;

  // Select a category randomly to force variety in the AI request too
  const forcedCategory = CHALLENGE_CATEGORIES[Math.floor(Math.random() * CHALLENGE_CATEGORIES.length)];

  const prompt = `
    Crie um DESAFIO INÉDITO para o casal ${p1Name} e ${p2Name}.
    
    ### RESTRIÇÕES (Anti-Repetição):
    NÃO gere desafios com os seguintes títulos (já foram usados): 
    ${JSON.stringify(recentTitles.slice(-10))}

    ### CATEGORIA OBRIGATÓRIA:
    >>> ${forcedCategory} <<<
    
    ### DIRETRIZES:
    1. **Criatividade**: Seja original. Saia do óbvio.
    2. **Sem Micos Bobos**: Evite coisas infantis, foque em habilidade, conexão ou utilidade.
    3. **Prenda Construtiva**: A penalidade deve ser útil (limpar algo, organizar) ou carinhosa (massagem), nunca humilhante.
    
    Responda em JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        temperature: 1.1, // Higher, creative temperature
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título criativo" },
            description: { type: Type.STRING, description: "Regras claras" },
            victoryCriteria: { type: Type.STRING, description: "Como vencer" },
            financialOption: { type: Type.STRING, description: "Sorteio de número (Fixo)" },
            taskOption: { type: Type.STRING, description: "Prenda de serviço ou afeto" }
          },
          required: ["title", "description", "victoryCriteria", "financialOption", "taskOption"],
        },
      }
    });

    const text = response.text;
    if (!text) return fallback;
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    const data = JSON.parse(cleanText);

    // Fallback safe defaults if AI hallucinates
    if (!data.financialOption) data.financialOption = "Sortear 1 número extra";

    return data;
  } catch (error) {
    console.error("Gemini Challenge Error:", error);
    return fallback;
  }
};

export const getPrediction = async (
  p1Name: string,
  p2Name: string,
  historyData: any[],
  goalData: { totalGoal: number, currentSaved: number, monthsElapsed: number }
): Promise<AiPrediction> => {
  const ai = getAiClient();

  // Fallback realista para quando a IA falhar ou não houver chave
  // Isso evita o estado eterno de "Calculando..."
  const fallback: AiPrediction = {
    likelyFinishDate: "Dez/2026",
    paceAnalysis: "Com o ritmo atual, vocês atingirão a meta em 14 meses.",
    optimisticScenario: "Se investirem, podem antecipar para Out/2026.",
    pessimisticScenario: "Sem proteção contra inflação, o prazo pode subir para 16 meses.",
    recommendation: "Invistam o saldo acumulado em um CDB 110% do CDI imediatamente.",
    investmentRoiEstimate: "R$ 150,00/mês",
    timeReductionWithInvestment: "2 meses a menos"
  };

  if (!ai) return fallback;

  const prompt = `
    ANÁLISE FINANCEIRA AVANÇADA (PRO):
    - Casal: ${p1Name} e ${p2Name}
    - Meta Total: ${formatCurrency(goalData.totalGoal)}
    - Total Acumulado: ${formatCurrency(goalData.currentSaved)}
    - Meses Decorridos: ${goalData.monthsElapsed}
    
    Você é um analista de investimentos sênior.
    Gere uma PREDIÇÃO baseada em matemática financeira real.
    
    1. Calcule o CDI aproximado de 1% a.m sobre o montante.
    2. Dê uma recomendação de ALTO NÍVEL (ex: LCI/LCA, Tesouro, ETFs conservadores).
    3. Seja realista sobre inflação e poder de compra.
    
    Responda EXCLUSIVAMENTE com o JSON abaixo formatado corretamente:
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        temperature: 0.4, // Analytical precision
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            likelyFinishDate: { type: Type.STRING, description: "Data estimada (Mês/Ano)" },
            paceAnalysis: { type: Type.STRING, description: "Análise do progresso atual" },
            optimisticScenario: { type: Type.STRING, description: "Cenário com investimentos" },
            pessimisticScenario: { type: Type.STRING, description: "Cenário sem ação/inflação" },
            recommendation: { type: Type.STRING, description: "Dica curta e direta" },
            investmentRoiEstimate: { type: Type.STRING, description: "Valor monetário estimado" },
            timeReductionWithInvestment: { type: Type.STRING, description: "Tempo economizado" }
          },
          required: ["likelyFinishDate", "paceAnalysis", "optimisticScenario", "pessimisticScenario", "recommendation", "investmentRoiEstimate", "timeReductionWithInvestment"]
        }
      }
    });

    const text = response.text;
    if (!text) return fallback;
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    return fallback;
  }
};