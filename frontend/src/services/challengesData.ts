import { AiChallenge, AiIncentive } from "./aiTypes";

export const STATIC_INCENTIVES: AiIncentive[] = [
    {
        title: "Regra 50/30/20",
        practicalTip: "Dividam a renda: 50% para necessidades, 30% para desejos e 20% OBRIGATÓRIO para a meta do Bingo.",
        bingoImpact: "Organiza o fluxo de caixa.",
        timeImpact: "Garante consistência mensal."
    },
    {
        title: "Dia do Zero Gasto",
        practicalTip: "Escolham um dia na semana para não gastar absolutamente nada além do fixo. Cozinhem em casa, lazer gratuito.",
        bingoImpact: "Economia direta de R$ 50-100 por semana.",
        timeImpact: "Acelera a meta em ~2 semanas."
    },
    {
        title: "Varredura de Assinaturas",
        practicalTip: "Revisem a fatura do cartão. Cancelem apps e streamings que não usaram no último mês.",
        bingoImpact: "Recupera R$ 30-80 mensais recorrentes.",
        timeImpact: "Reduz o prazo final em meses."
    },
    {
        title: "Venda do Desapego",
        practicalTip: "Cada um escolhe 3 itens (roupas, eletrônicos) parados há 6 meses e anuncia hoje.",
        bingoImpact: "Injeção imediata de caixa (R$ 100+).",
        timeImpact: "Pode quitar vários números de uma vez."
    },
    {
        title: "Taxa da Preguiça",
        practicalTip: "Toda vez que pedirem delivery por preguiça de cozinhar, depositem 10% do valor do pedido no Bingo.",
        bingoImpact: "Transforma gasto 'ruim' em investimento.",
        timeImpact: "Aumenta o aporte semanal."
    },
    {
        title: "Desafio do Café Investido",
        practicalTip: "Troquem o café/lanche da rua por levar de casa. O valor economizado vai direto pro Bingo no mesmo dia.",
        bingoImpact: "R$ 10-20 diários somam muito.",
        timeImpact: "Cria hábito de aporte diário."
    },
    {
        title: "Renegociação Anual",
        practicalTip: "Liguem para internet/celular ameaçando cancelar. O desconto obtido vira aporte mensal fixo.",
        bingoImpact: "Renda passiva gerada por economia.",
        timeImpact: "Ganho recorrente sem esforço extra."
    },
    {
        title: "CDB Liquidez Diária",
        practicalTip: "Não deixem o dinheiro do Bingo na conta corrente. Mover para um CDB rende 100% do CDI todo dia útil.",
        bingoImpact: "O dinheiro trabalha enquanto vocês dormem.",
        timeImpact: "Protege o poder de compra da meta."
    },
    {
        title: "Compras com Lista",
        practicalTip: "Nunca vao ao mercado com fome ou sem lista. Comprem APENAS o listado.",
        bingoImpact: "Evita gastos por impulso (30% da conta).",
        timeImpact: "Sobra mais margem para o Bingo."
    },
    {
        title: "Marca Própria",
        practicalTip: "No mercado, troquem marcas famosas pelas marcas do mercado em itens básicos de limpeza e despensa.",
        bingoImpact: "Produto igual, preço 30% menor.",
        timeImpact: "Eficiência de custo imediata."
    }
];

export const CHALLENGE_CATEGORIES = [
    "HABILIDADE / PRECISÃO",
    "TEMPO / RESISTÊNCIA",
    "SORTE CONTROLADA",
    "MEMÓRIA / ATENÇÃO",
    "CRIATIVOS (COM CRITÉRIO)",
    "DESAFIOS DOMÉSTICOS",
    "FINANCEIRO / NEGOCIAÇÃO"
];

export const STATIC_CHALLENGES: AiChallenge[] = [
    // --- HABILIDADE / PRECISÃO ---
    {
        title: "Torre Estável",
        description: "Montem uma torre usando objetos próximos (livros, copos, etc). Quem montar a mais alta que fique 10s em pé vence.",
        victoryCriteria: "Maior altura sem cair.",
        financialOption: "Sortear 1 número extra",
        taskOption: "O perdedor deve arrumar a 'bagunça' da torre e mais um cômodo."
    },
    {
        title: "Moeda no Copo",
        description: "Coloque um copo a 2 metros. Cada um tem 5 tentativas de acertar uma moeda dentro.",
        victoryCriteria: "Quem acertar mais vezes vence.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Fazer uma massagem nos pés do vencedor por 10 min."
    },
    {
        title: "Arremesso de Meia",
        description: "Faça uma bola de meia. Escolha um alvo fixo (cesto ou balde). Melhor de 5 arremessos.",
        victoryCriteria: "Maior número de acertos.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Preparar o café da manhã na cama amanhã."
    },
    {
        title: "Desenho às Cegas",
        description: "Vendem os olhos. Um dita um objeto, o outro desenha. Depois trocam.",
        victoryCriteria: "O desenho mais reconhecível vence (julguem honestamente!).",
        financialOption: "Sortear 1 número extra",
        taskOption: "O perdedor lava a louça do dia."
    },
    {
        title: "Equilíbrio em Um Pé",
        description: "Fiquem em um pé só (posição de garça). Quem desequilibrar ou colocar o pé no chão primeiro perde.",
        victoryCriteria: "Último a ficar em pé.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Fazer uma massagem nos ombros do vencedor."
    },

    // --- TEMPO / RESISTÊNCIA ---
    {
        title: "Desafio da Prancha",
        description: "Posição de prancha abdominal no chão. Quem aguentar mais tempo vence.",
        victoryCriteria: "Maior tempo resistido.",
        financialOption: "Sortear 1 número extra",
        taskOption: "O perdedor faz 20 polichinelos agora."
    },
    {
        title: "Agachamento Estático",
        description: "Encostem as costas na parede e agachem (cadeirinha). Quem subir ou cair primeiro perde.",
        victoryCriteria: "Maior resistência.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Trazer água/bebida para o vencedor sempre que ele pedir hoje."
    },
    {
        title: "Gelo na Mão",
        description: "Segurem um cubo de gelo na mão fechada. Quem soltar primeiro perde.",
        victoryCriteria: "Maior tolerância ao frio.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Esquentar as mãos do vencedor com uma massagem."
    },
    {
        title: "Respiração Controlada",
        description: "Inspirem fundo e segurem o ar (embaixo d'água ou não). Quem soltar primeiro perde.",
        victoryCriteria: "Maior tempo sem respirar.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Fazer cafuné até o vencedor dormir hoje."
    },
    {
        title: "Imobilidade Total",
        description: "Estátua! Quem se mexer, piscar excessivamente ou rir primeiro perde.",
        victoryCriteria: "Controle corporal absoluto.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Ser o 'mordomo' do vencedor pela próxima hora."
    },

    // --- SORTE CONTROLADA ---
    {
        title: "Cara ou Coroa MD10",
        description: "Lancem uma moeda 10 vezes anotando. Quem acertar mais o lado vence.",
        victoryCriteria: "Maior número de previsões corretas.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Limpar os espelhos da casa."
    },
    {
        title: "Número da Sorte",
        description: "Cada um escolhe um número de 1 a 10. Peçam pro Google/Siri sortear um número. Quem chegar mais perto vence.",
        victoryCriteria: "Menor diferença para o número sorteado.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Escolher o filme/série da noite."
    },
    {
        title: "Dado Improvisado",
        description: "Usem um dado virtual (Google 'rolar dado'). Quem tirar o maior número em uma rodada vence. (Melhor de 3).",
        victoryCriteria: "Maior soma nas 3 rodadas.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Preparar um lanche especial para o vencedor."
    },
    {
        title: "Par ou Ímpar Estratégico",
        description: "Melhor de 5 rodadas de Par ou Ímpar.",
        victoryCriteria: "Quem ganhar 3 rodadas.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Tirar o lixo hoje."
    },
    {
        title: "Carta Alta",
        description: "Usem um baralho (ou app). Cada um tira uma carta. A maior vence. (Ás é maior).",
        victoryCriteria: "Carta de maior valor.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Organizar a mesa de trabalho/estudos do vencedor."
    },

    // --- MEMÓRIA / ATENÇÃO ---
    {
        title: "Cena Rápida",
        description: "Um observa o cômodo por 30s e fecha os olhos. O outro muda um objeto de lugar. Quem descobrir em menos tempo vence (façam rodadas alternadas).",
        victoryCriteria: "Menor tempo para notar a mudança.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Arrumar a cama perfeitamente amanhã."
    },
    {
        title: "Lista Relâmpago",
        description: "Tema: 'Frutas' ou 'Marcas de Carro'. 60 segundos. Quem escrever mais itens VÁLIDOS vence.",
        victoryCriteria: "Maior quantidade de itens únicos.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Fazer uma lista de compras ou tarefas pendentes do casal."
    },
    {
        title: "Sequência de Palmas",
        description: "Um faz uma sequência rítmica de palmas, o outro repete. Aumentem a dificuldade. Quem errar primeiro perde.",
        victoryCriteria: "Memória auditiva e ritmo.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Dançar uma música escolhida pelo vencedor."
    },
    {
        title: "Ordem Correta",
        description: "Um coloca 5 objetos em ordem na mesa. O outro olha por 10s. Embaralhe. O outro tem que reordenar.",
        victoryCriteria: "Acertar a ordem exata.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Organizar uma gaveta bagunçada da casa."
    },

    // --- CRIATIVOS ---
    {
        title: "Dublagem Muda",
        description: "A TV no mudo passando uma cena. Improvisem o diálogo. Quem fizer o outro rir primeiro perde (ou ganha, decidam!).",
        victoryCriteria: "Fazer o outro rir.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Fazer uma imitação de alguém famoso."
    },
    {
        title: "História em 30s",
        description: "Um começa uma história com uma palavra, o outro continua. Quem travar por mais de 3s perde.",
        victoryCriteria: "Fluidez e criatividade.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Escrever um bilhete romântico e esconder pro outro achar."
    },
    {
        title: "Batalha de Títulos",
        description: "Inventem um título para um filme sobre a vida de vocês hoje. O mais criativo vence.",
        victoryCriteria: "Melhor título (senso crítico mútuo).",
        financialOption: "Sortear 1 número extra",
        taskOption: "Postar uma foto do casal com a legenda escolhida pelo vencedor."
    },

    // --- DOMÉSTICOS ---
    {
        title: "Cama Perfeita",
        description: "Cronometrado: Quem arruma o seu lado da cama (ou faz a cama toda se revezarem) melhor e mais rápido?",
        victoryCriteria: "Estética e velocidade.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Trocar os lençóis na próxima vez."
    },
    {
        title: "Organização Express",
        description: "Escolham uma área (mesa, sofá). 2 minutos para organizar. Quem deixar melhor vence.",
        victoryCriteria: "Transformação visual.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Manter essa área organizada por 3 dias."
    },
    {
        title: "Dobrar Roupas Ninja",
        description: "Peguem 10 peças de roupa cada. Quem dobrar tudo (bem feito!) primeiro vence.",
        victoryCriteria: "Velocidade e qualidade da dobra.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Guardar todas as roupas dobradas."
    },
    {
        title: "Silêncio Absoluto",
        description: "A partir de AGORA. Quem falar qualquer palavra primeiro perde.",
        victoryCriteria: "Auto-controle total.",
        financialOption: "Sortear 1 número extra",
        taskOption: "O perdedor não pode escolher o que assistir na TV hoje."
    },

    // --- FINANCEIROS / NEGOCIAÇÃO (Mantidos da lista anterior) ---
    {
        title: "Caça ao Tesouro em Casa",
        description: "Cada um tem 10 minutos para encontrar itens parados que podem ser vendidos na OLX/Enjoei.",
        victoryCriteria: "Quem encontrar o item de maior valor de revenda vence.",
        financialOption: "Sortear 1 número extra",
        taskOption: "O perdedor deve anunciar os itens do vencedor online."
    },
    {
        title: "Masterchef da Economia",
        description: "Cozinhar um jantar 'Gourmet' usando apenas o que já tem na geladeira/despensa.",
        victoryCriteria: "Sabor e criatividade (sem gastar 1 centavo).",
        financialOption: "Sortear 1 número extra",
        taskOption: "Lavar toda a louça do jantar."
    },
    {
        title: "Negociador Implacável",
        description: "Liguem para serviços (internet, TV, banco) e tentem desconto.",
        victoryCriteria: "Quem conseguir a maior economia anual projetada vence.",
        financialOption: "Sortear 1 número extra",
        taskOption: "Fazer uma massagem relaxante no vencedor."
    }
];
