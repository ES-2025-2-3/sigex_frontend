import { observable, action, makeObservable, computed } from "mobx";
import DomainBase from "../DomainBase";

class EventDomain extends DomainBase {
  @observable accessor id: number | null = null;
  @observable accessor title = "";
  @observable accessor description = "";
  @observable accessor imageUrl = "";
  @observable accessor tags: string[] = [];
  @observable accessor registrationLink = "";
  @observable accessor additionalInfo = "";
  @observable accessor isPublic: boolean = true;

  constructor(event?: Record<string, unknown>) {
    super();
    makeObservable(this);

    if (event) {
      this.id = (event.id as number) || null;
      this.title = (event.name as string) || "";
      this.description = (event.description as string) || "";
      this.isPublic = event.visibility === "PUBLIC";
      this.tags = (event.tags as string[]) || [];
      this.imageUrl = (event.imageUrls as string[])?.[0] || "";
      this.registrationLink = (event.relatedLinks as string[])?.[0] || "";
      this.additionalInfo = (event.additionalInfo as string) || "";
    }
  }

  @computed
  get hasExternalRegistration(): boolean {
    return !!this.registrationLink && this.registrationLink.trim().length > 0;
  }

  @action
  validate(stepOrField?: string) {
    const currentStep = stepOrField ? parseInt(stepOrField) : null;

    if (!currentStep || currentStep === 1) {
      delete this.errors["title"];
      delete this.errors["description"];

      if (!this.title || this.title.trim().length === 0) {
        this.errors["title"] = "O nome do evento é obrigatório";
      }
      if (!this.description || this.description.trim().length === 0) {
        this.errors["description"] = "A descrição é obrigatória";
      }
    }

    if (this.isPublic && (!currentStep || currentStep === 2)) {
      delete this.errors["registrationLink"];
      if (this.registrationLink && this.registrationLink.trim().length > 0) {
        this.validateUrl(this.registrationLink);
      }
    }
  }

  private validateUrl(url: string) {
    try {
      new URL(url);
    } catch (_) {
      this.errors["registrationLink"] = "A URL informada é inválida";
    }
  }

  getBackendObject() {
    return {
      name: this.title.trim(),
      description: this.description,
      visibility: this.isPublic ? "PUBLIC" : "PRIVATE",
      tags: this.tags || [],
      imageUrls: this.imageUrl ? [this.imageUrl] : [],
      relatedLinks: this.registrationLink ? [this.registrationLink] : [],
      additionalInfo: this.additionalInfo,
    };
  }
}

export default EventDomain;
