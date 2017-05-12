export class CollapsibleComponentCtrl {
  public optionsOpen: boolean = false;
  constructor() {
  }

  public toggleOptions():void {
    this.optionsOpen = !this.optionsOpen;
  }
}
