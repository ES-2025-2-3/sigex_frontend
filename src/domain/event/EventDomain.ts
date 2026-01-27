import { observable, action, makeObservable, computed } from 'mobx';
import DomainBase from '../DomainBase';

class EventDomain extends DomainBase {
  @observable accessor id: number | null = null;
  @observable accessor titulo = '';
  @observable accessor data = '';
  @observable accessor descricao = '';
  @observable accessor imagemUrl = '';
  @observable accessor local = '';
  @observable accessor tags: string[] = [];
  @observable accessor linkInscricao = '';
  @observable accessor informacoesAdicionais = '';

  constructor(event?: Record<string, unknown>) {
    super();
    makeObservable(this);

    if (event) {
      this.setData(event);
    }
  }

  /**
   * Computado para verificar se o evento possui link de inscrição
   */
  @computed
  get hasExternalRegistration(): boolean {
    return !!this.linkInscricao && this.linkInscricao.trim().length > 0;
  }

  /**
   * Validação dos campos de evento
   */
  @action
  validate(field?: string) {
    if (field) {
      super.validate(field);
      if (field === 'linkInscricao' && this.linkInscricao) {
        this.validateUrl(this.linkInscricao);
      }
    } else {
      super.validate(undefined, () => {
        if (!this.titulo) this.errors['titulo'] = 'Título é obrigatório';
        if (!this.data) this.errors['data'] = 'Data é obrigatória';
        if (!this.local) this.errors['local'] = 'Local é obrigatório';
        if (!this.descricao) this.errors['descricao'] = 'Descrição é obrigatória';
        
        if (this.linkInscricao) {
          this.validateUrl(this.linkInscricao);
        }
      });
    }
  }

  /**
   * Valida se o link de inscrição é uma URL válida
   */
  private validateUrl(url: string) {
    try {
      new URL(url);
    } catch (_) {
      this.errors['linkInscricao'] = 'URL inválida';
    }
  }

  getBackendObject() {
    const obj = super.getBackendObject();
    return obj;
  }
}

export default EventDomain;