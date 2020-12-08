import { AfterViewInit, Component, Renderer2, ViewChild } from '@angular/core';
import { Animation, AnimationController, Gesture, GestureController, GestureDetail, Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('blocks') blocks: any;
  @ViewChild('background') background: any;
  @ViewChild('swipeDown') swipeDown: any;

  public options: Array<any> = [
    { icon: 'person-add-outline', text: 'Indicar amigos' },
    { icon: 'phone-portrait-outline', text: 'Recarregar celular' },
    { icon: 'wallet-outline', text: 'Depositar' },
    { icon: 'options-outline', text: 'Ajustar limite' },
    { icon: 'help-circle-outline', text: 'Me ajuda' },
    { icon: 'barcode-outline', text: 'Pagar' },
    { icon: 'lock-open-outline', text: 'Bloquear cartão' },
    { icon: 'card-outline', text: 'Cartão virtual' },
  ];

  public items: Array<any> = [
    { icon: 'help-circle-outline', text: 'Me ajuda' },
    { icon: 'person-outline', text: 'Perfil' },
    { icon: 'cash-outline', text: 'Configurar conta' },
    { icon: 'card-outline', text: 'Configurar cartão' },
    { icon: 'phone-portrait-outline', text: 'Configuração do app' },
  ];

  public slidesOptions: any = { slidesPerView: 3, freeMode: true };
  public initialStep = 0;

  private maxtranslate: number;
  private animation: Animation;
  private gesture: Gesture;
  public swiping = false;

  constructor(
    private animationCtl: AnimationController,
    private platform: Platform,
    private renderer: Renderer2,
    private gestureCtrl: GestureController
  ) {
    this.maxtranslate = this.platform.height() - 200;
  }

  ngAfterViewInit() {
    this.createAnimation();
    this.detectSwipe();
  }

  detectSwipe() {
    this.gesture = this.gestureCtrl.create({
      el: this.swipeDown.el,
      gestureName: 'swipe-down',
      threshold: 0,
      onMove: ev => this.onMove(ev),
      onEnd: ev => this.onEnd(ev)
    }, true);

    this.gesture.enable(true);
  }

  onMove(ev: GestureDetail) {
    if (!this.swiping) {
      this.animation.direction('normal').progressStart(true);

      this.swiping = true;
    }

    const step: number = this.getStep(ev);

    this.animation.progressStep(step);
    this.setBackgroundOpacity(step);
  }

  getStep(ev: GestureDetail): number {
    const delta: number = this.initialStep + ev.deltaY;

    return delta / this.maxtranslate;
  }

  toggleBlock() {
    this.initialStep = this.initialStep === 0 ? this.maxtranslate : 0;

    this.gesture.enable(false);

    this.animation.direction(this.initialStep === 0 ? 'reverse' : 'normal').play();

    this.setBackgroundOpacity();
  }

  createAnimation() {
    this.animation = this.animationCtl.create()
      .addElement(this.blocks.nativeElement)
      .duration(300)
      .fromTo('transform', 'translateY(0)', `translateY(${this.maxtranslate}px)`)
      .onFinish(() => this.gesture.enable(true));
  }

  fixedBlocks(): boolean {
    return this.swiping || this.initialStep === this.maxtranslate;
  }

  setBackgroundOpacity(value: number = null) {
    this.renderer.setStyle(this.background.nativeElement, 'opacity', value ? value : this.initialStep === 0 ? '0' : '1');
  }

  onEnd(ev: GestureDetail) {
    if (!this.swiping) {
      return;
    }

    this.gesture.enable(false);

    const step: number = this.getStep(ev);
    const shouldComplete: boolean = step > 0.5;

    this.animation.progressEnd(shouldComplete ? 1 : 0, step);

    this.initialStep = shouldComplete ? this.maxtranslate : 0;

    this.setBackgroundOpacity();

    this.swiping = false;
  }
}
