export type Papel = 'Psicologo' | 'Paciente';
export type Nivel = 'nenhum' | 'atencao' | 'risco';
export type PerfilStatus = 'rascunho' | 'pendente' | 'aprovado' | 'reprovado';
export type StatusPaciente = 'convidado' | 'ativo' | 'removido';
export type Frequencia = 'diaria' | 'semanal' | 'sob_demanda';

export const ABORDAGENS = ['TCC', 'ACT', 'Psicanalise', 'Humanista', 'Sistemica', 'Outra'] as const;
export const ROTULO_ABORDAGEM: Record<string, string> = {
  TCC: 'TCC',
  ACT: 'ACT',
  Psicanalise: 'Psicanálise',
  Humanista: 'Humanista',
  Sistemica: 'Sistêmica',
  Outra: 'Outra',
};
export const ROTULO_FREQUENCIA: Record<Frequencia, string> = {
  diaria: 'Diária',
  semanal: 'Semanal',
  sob_demanda: 'Sob demanda',
};

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
}

export interface FormPessoal {
  comoPrefereSerChamado: string;
  rotina: string | null;
  oQueAjuda: string | null;
  evitar: string | null;
  tom: 'acolhedor' | 'direto';
}

export interface TarefaDia {
  id: string;
  descricao: string;
  frequencia: Frequencia;
  feitaHoje: boolean;
}

export interface MeuAcompanhamento {
  nome: string;
  perfilStatus: PerfilStatus;
  consentimentoEm: string | null;
  pessoalPreenchido: boolean;
  pessoal: FormPessoal | null;
  tarefas: TarefaDia[];
  limite: number;
  restantes: number;
}

export interface MsgPaciente {
  id: string;
  papel: 'paciente' | 'agente';
  texto: string;
  criadaEm: string;
}

export interface MinhaConversa {
  saudacao: string;
  mensagens: MsgPaciente[];
  restantes: number;
  limite: number;
}

export interface EnvioResultado {
  mensagemPaciente: MsgPaciente;
  mensagemAgente: MsgPaciente;
  restantes: number;
}

export interface PacienteLista {
  id: string;
  nome: string;
  email: string;
  status: StatusPaciente;
  perfilStatus: PerfilStatus;
  nivelAlerta: Nivel;
  alertasNaoLidos: number;
  ultimaMensagemEm: string | null;
}

export interface TarefaForm {
  id?: string;
  descricao: string;
  frequencia: Frequencia;
}

export interface GatilhoForm {
  id?: string;
  texto: string;
  nivel: 'atencao' | 'risco';
}

export interface PacienteDetalhe {
  id: string;
  nome: string;
  email: string;
  status: StatusPaciente;
  perfilStatus: PerfilStatus;
  perfilMotivoReprovacao: string | null;
  consentimentoEm: string | null;
  conviteEnviadoEm: string | null;
  abordagem: string | null;
  observacoes: string | null;
  temas: string[];
  tarefas: TarefaForm[];
  gatilhos: GatilhoForm[];
  pessoal: FormPessoal | null;
}

export interface MsgPsicologo extends MsgPaciente {
  risco: Nivel | null;
  motivoRisco: string | null;
  naoClassificada: boolean;
  foraDoEscopo: boolean;
  temaPauta: string | null;
  fixa: boolean;
}

export interface Alerta {
  id: string;
  nivel: 'atencao' | 'risco';
  lido: boolean;
  criadoEm: string;
  texto: string;
}

export interface Resumo {
  id: string;
  dia: string;
  texto: string;
  geradoEm: string;
}

export interface Pauta {
  id: string;
  texto: string;
  itens: string[];
  geradoEm: string;
}

export interface Convite {
  id: string;
  linkConvite: string;
  emailEnviado: boolean;
}
