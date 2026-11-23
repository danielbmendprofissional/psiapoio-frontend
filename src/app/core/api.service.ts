import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  Alerta,
  Convite,
  EnvioResultado,
  FormPessoal,
  GatilhoForm,
  MeuAcompanhamento,
  MinhaConversa,
  MsgPsicologo,
  PacienteDetalhe,
  PacienteLista,
  Pauta,
  Resumo,
  TarefaForm,
} from './models';

const V1 = '/api/v1';

export interface ApiErro {
  status: number;
  codigo: string;
  mensagem: string;
}

/** Converte qualquer falha de HTTP em {status, codigo, mensagem} para a tela decidir o que mostrar. */
export function lerErro(e: unknown): ApiErro {
  if (e instanceof HttpErrorResponse) {
    const corpo = e.error as { codigo?: string; title?: string } | null;
    if (e.status === 0) {
      return { status: 0, codigo: 'sem_conexao', mensagem: 'Não consegui falar com o servidor. Tente de novo em instantes.' };
    }
    return {
      status: e.status,
      codigo: corpo?.codigo ?? 'erro',
      mensagem: corpo?.title ?? 'Algo deu errado. Tente de novo.',
    };
  }
  return { status: 0, codigo: 'erro', mensagem: 'Algo deu errado. Tente de novo.' };
}

export interface ClinicoPayload {
  abordagem: string | null;
  observacoes: string | null;
  temas: string[];
  tarefas: TarefaForm[];
  gatilhos: GatilhoForm[];
}

export interface PessoalPayload {
  comoPrefereSerChamado: string;
  rotina: string;
  oQueAjuda: string;
  evitar: string;
  tom: FormPessoal['tom'];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  private get<T>(url: string) {
    return firstValueFrom(this.http.get<T>(`${V1}${url}`));
  }
  private post<T>(url: string, corpo: unknown = {}) {
    return firstValueFrom(this.http.post<T>(`${V1}${url}`, corpo));
  }
  private put<T>(url: string, corpo: unknown) {
    return firstValueFrom(this.http.put<T>(`${V1}${url}`, corpo));
  }
  private del<T>(url: string) {
    return firstValueFrom(this.http.delete<T>(`${V1}${url}`));
  }

  // ---- Paciente ----
  meuAcompanhamento = () => this.get<MeuAcompanhamento>('/meu/acompanhamento');
  consentir = () => this.post<void>('/meu/consentimento');
  salvarPessoal = (p: PessoalPayload) => this.put<void>('/meu/pessoal', p);
  minhaConversa = () => this.get<MinhaConversa>('/meu/conversa');
  enviarMensagem = (texto: string) => this.post<EnvioResultado>('/meu/conversa/mensagens', { texto });
  marcarTarefa = (id: string) => this.post<{ feita: boolean }>(`/meu/tarefas/${id}/marcacao`);

  // ---- Psicólogo ----
  pacientes = () => this.get<PacienteLista[]>('/pacientes');
  cadastrarPaciente = (nome: string, email: string) => this.post<Convite>('/pacientes', { nome, email });
  reenviarConvite = (id: string) => this.post<Convite>(`/pacientes/${id}/convite`);
  removerPaciente = (id: string) => this.del<void>(`/pacientes/${id}`);
  paciente = (id: string) => this.get<PacienteDetalhe>(`/pacientes/${id}`);
  salvarClinico = (id: string, p: ClinicoPayload) => this.put<PacienteDetalhe>(`/pacientes/${id}/clinico`, p);
  aprovarPerfil = (id: string) => this.post<void>(`/pacientes/${id}/perfil/aprovar`);
  reprovarPerfil = (id: string, motivo: string) => this.post<void>(`/pacientes/${id}/perfil/reprovar`, { motivo });
  conversaDoPaciente = (id: string) => this.get<MsgPsicologo[]>(`/pacientes/${id}/conversa`);
  alertas = (id: string) => this.get<Alerta[]>(`/pacientes/${id}/alertas`);
  marcarAlertasLidos = (id: string) => this.post<void>(`/pacientes/${id}/alertas/lidos`);
  resumos = (id: string) => this.get<Resumo[]>(`/pacientes/${id}/resumos`);
  gerarResumo = (id: string, dia?: string) => this.post<Resumo>(`/pacientes/${id}/resumos`, dia ? { dia } : {});
  pauta = (id: string) => this.get<Pauta | null>(`/pacientes/${id}/pauta`);
  gerarPauta = (id: string) => this.post<Pauta>(`/pacientes/${id}/pauta`);
}
