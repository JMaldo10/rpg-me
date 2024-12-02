/**
 * Copyright 2024 Jeremy Maldonado
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import '@rough-stuff/wired-elements/wired-input.js';
import '@rough-stuff/wired-elements/wired-slider.js';
import '@rough-stuff/wired-elements/wired-checkbox.js';

/**
 * `rpg-me`
 * 
 * @demo index.html
 * @element rpg-me
 */
export class RpgMe extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "rpg-me";
  }

  constructor() {
    super();
    this.title = "RPG Character Builder";
    this.seed = "1234567890";
    this.characterAttributes = {
      accessories: 0,
      base: 1,
      face: 0,
      faceitem: 0,
      hair: 0,
      pants: 0,
      shirt: 0,
      skin: 0,
      hatcolor: 0,
      hat: "none",
      fire: false,
      walking: false,
      circle: false
    };
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Character Builder",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/rpg-me.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      seed: { type: String },
      characterAttributes: { type: Object },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
        }
        .wrapper {
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
        }
        .inputs {
          display: flex;
          flex-direction: column;
          padding: 10px;
        }
        .input-group {
          margin-bottom: 15px;
        }
        button {
          background-color: #0078d4;
          color: white;
          border: none;
          padding: 10px;
          cursor: pointer;
          border-radius: 5px;
        }
        button:hover {
          background-color: #005a9e;
        }
        .character-display {
          margin-bottom: 20px;
        }
      `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        <h3><span>${this.t.title}:</span> ${this.title}</h3>
        <div class="character-display">
          <rpg-character 
            id="character" 
            .seed="${this.seed}"
            .accessories="${this.characterAttributes.accessories}"
            .base="${this.characterAttributes.base}"
            .face="${this.characterAttributes.face}"
            .faceitem="${this.characterAttributes.faceitem}"
            .hair="${this.characterAttributes.hair}"
            .pants="${this.characterAttributes.pants}"
            .shirt="${this.characterAttributes.shirt}"
            .skin="${this.characterAttributes.skin}"
            .hatcolor="${this.characterAttributes.hatcolor}"
            .hat="${this.characterAttributes.hat}"
            .fire="${this.characterAttributes.fire}"
            .walking="${this.characterAttributes.walking}"
            .circle="${this.characterAttributes.circle}"
          ></rpg-character>
        </div>

        <div class="inputs">
          <div class="input-group">
            <label>Accessories:</label>
            <wired-slider min="0" max="9" .value="${this.characterAttributes.accessories}" @input="${this.updateCharacter}" name="accessories"></wired-slider>
          </div>

          <div class="input-group">
            <label>Base (Male/Female):</label>
            <wired-input .value="${this.characterAttributes.base}" @input="${this.updateCharacter}" name="base"></wired-input>
          </div>

          <div class="input-group">
            <label>Face:</label>
            <wired-slider min="0" max="5" .value="${this.characterAttributes.face}" @input="${this.updateCharacter}" name="face"></wired-slider>
          </div>

          <div class="input-group">
            <label>Fire:</label>
            <wired-checkbox .checked="${this.characterAttributes.fire}" @change="${this.updateCharacter}" name="fire"></wired-checkbox>
          </div>

          <div class="input-group">
            <label>Hat Color:</label>
            <wired-slider min="0" max="9" .value="${this.characterAttributes.hatcolor}" @input="${this.updateCharacter}" name="hatcolor"></wired-slider>
          </div>

          <div class="input-group">
            <label>Hat:</label>
            <wired-input .value="${this.characterAttributes.hat}" @input="${this.updateCharacter}" name="hat"></wired-input>
          </div>

          <button @click="${this.generateShareLink}">Share</button>
          <div id="share-link"></div>
        </div>
      </div>
    `;
  }

  updateCharacter(event) {
    const { name, value } = event.target;
    this.characterAttributes[name] = value;
    this.requestUpdate();
    this.updateURLParams();
  }

  updateURLParams() {
    const urlParams = new URLSearchParams();
    Object.keys(this.characterAttributes).forEach(key => {
      urlParams.set(key, this.characterAttributes[key]);
    });
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
  }

  generateShareLink() {
    const urlParams = new URLSearchParams();
    Object.keys(this.characterAttributes).forEach(key => {
      urlParams.set(key, this.characterAttributes[key]);
    });

    const shareURL = `${window.location.origin}?${urlParams.toString()}`;
    const shareLinkDiv = this.shadowRoot.getElementById('share-link');
    shareLinkDiv.textContent = `Shareable link: ${shareURL}`;
    navigator.clipboard.writeText(shareURL).then(() => {
      console.log('Link copied to clipboard!');
    });
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(RpgMe.tag, RpgMe);