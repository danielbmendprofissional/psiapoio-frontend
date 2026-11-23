// PROTÓTIPO DESCARTÁVEL: dados fictícios em memória. Nada aqui vai para produção.

export type Nivel = 'risco' | 'atencao' | 'nenhum';

export interface Msg {
  id: number;
  de: 'agente' | 'paciente';
  texto: string;
  hora: string;
  /** Classificação da mensagem do paciente (ADR 0002). */
  nivel?: Nivel;
  /** Resposta fixa de risco, não gerada pelo LLM. */
  fixa?: boolean;
}

export interface Tarefa {
  id: number;
  texto: string;
  frequencia: string;
  feitaHoje: boolean;
}

export interface DiaResumo {
  dia: string;
  humor: number; // 1..5
  humorRotulo: string;
  resumo: string;
  tarefasFeitas: number;
  tarefasTotal: number;
  mensagens: Msg[];
}

export interface PacienteProto {
  id: string;
  nome: string;
  nivel: Nivel;
  ultima: string;
  humor: string;
  perfilAprovado: boolean;
  alertaTexto?: string;
  dias: DiaResumo[];
  pauta: string[];
}

export const PSICOLOGA = 'Dra. Ana Ribeiro';
export const LIMITE_DIARIO = 20;

export const TAREFAS_CAMILA: Tarefa[] = [
  { id: 1, texto: 'Respiração 4-7-8 antes de dormir', frequencia: 'todo dia', feitaHoje: false },
  { id: 2, texto: 'Anotar pensamentos depois de reuniões', frequencia: '3 vezes por semana', feitaHoje: true },
];

export const MENSAGENS_BASE: Msg[] = [
  { id: 1, de: 'agente', hora: '08:02', texto: 'Bom dia, Camila. Como foi o exercício de respiração ontem à noite?' },
  { id: 2, de: 'paciente', hora: '08:05', texto: 'Fiz por cinco minutos. Consegui dormir mais cedo.', nivel: 'nenhum' },
  { id: 3, de: 'agente', hora: '08:05', texto: 'Que bom ouvir isso. Quer registrar como você está se sentindo agora?' },
];

export const RESPOSTA_RISCO =
  'Recebi sua mensagem. Já avisei a Dra. Ana e ela vai ver isso com cuidado. Você não está sozinha agora.';

export const RESPOSTA_FORA_ESCOPO =
  'Isso é um assunto para levar à sua sessão com a Dra. Ana. Vou deixar anotado para ela.';

export const GATILHOS_RISCO = /(sumir|desaparecer|não aguento|não quero mais|acabar com tudo)/i;

const msg = (id: number, de: Msg['de'], hora: string, texto: string, extra: Partial<Msg> = {}): Msg => ({
  id, de, hora, texto, ...extra,
});

export const PACIENTES: PacienteProto[] = [
  {
    id: 'helena',
    nome: 'Helena Marques',
    nivel: 'risco',
    ultima: 'hoje, 09:12',
    humor: 'Muito baixo',
    perfilAprovado: true,
    alertaTexto: 'Mensagem classificada como risco às 09:12. O paciente recebeu a resposta fixa.',
    pauta: [
      'Retomar o que aconteceu na noite de ontem, antes de qualquer outro assunto.',
      'Rever com ela a tarefa de registro de pensamentos, que não foi feita há 4 dias.',
      'Combinar como ela prefere ser contatada quando disser que está mal.',
    ],
    dias: [
      {
        dia: 'Hoje', humor: 1, humorRotulo: 'Muito baixo', tarefasFeitas: 0, tarefasTotal: 2,
        resumo: 'Dia em andamento. Helena escreveu de manhã que "não aguenta mais" e recebeu a resposta fixa de risco.',
        mensagens: [
          msg(1, 'agente', '09:00', 'Bom dia, Helena. Como você acordou hoje?'),
          msg(2, 'paciente', '09:10', 'Acordei péssima. Acho que não aguento mais isso.', { nivel: 'risco' }),
          msg(3, 'agente', '09:12', RESPOSTA_RISCO, { fixa: true }),
        ],
      },
      {
        dia: 'Ontem', humor: 2, humorRotulo: 'Baixo', tarefasFeitas: 1, tarefasTotal: 2,
        resumo: 'Humor baixo. Fez a respiração, mas não anotou pensamentos. Citou cansaço e discussão com a irmã.',
        mensagens: [
          msg(4, 'agente', '20:30', 'Boa noite, Helena. Conseguiu fazer a respiração hoje?'),
          msg(5, 'paciente', '20:41', 'Fiz. Mas briguei com minha irmã e fiquei mal o resto do dia.', { nivel: 'atencao' }),
          msg(6, 'agente', '20:42', 'Sinto que o dia foi pesado. Esse assunto é bom de levar para a sessão; vou deixar anotado para a Dra. Ana.'),
        ],
      },
    ],
  },
  {
    id: 'rafael',
    nome: 'Rafael Tavares',
    nivel: 'atencao',
    ultima: 'hoje, 07:40',
    humor: 'Baixo',
    perfilAprovado: true,
    alertaTexto: 'Mensagem classificada como atenção às 07:40 (gatilho "prazo").',
    pauta: [
      'Conversar sobre a pressão de prazos no trabalho, que apareceu duas vezes esta semana.',
      'Ver se o exercício de pausas curtas está sendo viável.',
    ],
    dias: [
      {
        dia: 'Hoje', humor: 2, humorRotulo: 'Baixo', tarefasFeitas: 0, tarefasTotal: 1,
        resumo: 'Acordou ansioso com um prazo. Pediu ajuda para lembrar o exercício de pausas.',
        mensagens: [
          msg(7, 'agente', '07:35', 'Bom dia, Rafael. Como está o seu dia começando?'),
          msg(8, 'paciente', '07:40', 'Com um prazo enorme hoje e a cabeça a mil.', { nivel: 'atencao' }),
          msg(9, 'agente', '07:41', 'Dá para fazer uma pausa curta agora. Quer que eu relembre o exercício combinado com a Dra. Ana?'),
        ],
      },
    ],
  },
  {
    id: 'camila',
    nome: 'Camila Duarte',
    nivel: 'nenhum',
    ultima: 'ontem, 21:05',
    humor: 'Estável',
    perfilAprovado: true,
    pauta: ['Voltar à tensão antes das reuniões de segunda-feira.', 'Ver como está o sono depois da respiração.'],
    dias: [
      {
        dia: 'Ontem', humor: 3, humorRotulo: 'Estável', tarefasFeitas: 2, tarefasTotal: 2,
        resumo: 'Dormiu melhor depois do exercício de respiração. Ainda sente tensão antes das reuniões de segunda.',
        mensagens: MENSAGENS_BASE,
      },
    ],
  },
  {
    id: 'beatriz',
    nome: 'Beatriz Lemos',
    nivel: 'nenhum',
    ultima: 'sem conversa',
    humor: '—',
    perfilAprovado: false,
    pauta: [],
    dias: [],
  },
];
