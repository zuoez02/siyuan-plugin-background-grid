const { Plugin, Menu, Dialog } = require("siyuan");

const iconBackgroundGrid =
  '<svg t="1689238674809" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10159" width="200" height="200"><path d="M392.52992 237.09696v243.968h238.94016V266.96704zM392.52992 786.87232l238.94016-29.87008v-207.6672H392.52992zM699.72992 481.06496H921.6V337.36704c0-18.76992-15.22688-36.0448-33.87392-38.36928l-187.99616-23.5008v205.568zM324.27008 481.06496V228.56704l-187.99616-23.5008C117.62688 202.73152 102.4 216.19712 102.4 234.96704v246.09792h221.87008zM324.27008 549.33504H102.4v239.6672c0 18.80064 15.22688 32.26624 33.87392 29.93152l187.99616-23.53152v-246.0672zM699.72992 549.33504v199.13728l187.99616-23.47008c18.6368-2.33472 33.87392-19.59936 33.87392-38.4V549.33504H699.72992z" p-id="10160"></path></svg>';

function registerIcon(name, size, svg) {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
          <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" xmlns="http://www.w3.org/2000/svg">
              <defs>
                  <symbol id="${name}" viewBox="0 0 ${size} ${size}">
                      ${svg}
                  </symbol>
              </defs>
          </svg>`
  );
}

const defaultConfig = {
  styleId: "background-grid-plugin",
  setting: {
    enabled: true,
    mode: "content", // content or editor
    type: "grid", // grid or point
    width: 20,
    size: 1,
    color: "#999999",
    opacity: 15,
    editable: "yes",
  },
};

class BackgroundGridPlugin extends Plugin {
  config = defaultConfig;

  async onload() {
    registerIcon("iconBackgroundGrid", 200, iconBackgroundGrid);
    await this.loadConfig();
    this.saveConfig();
    const topBarElement = this.addTopBar({
      icon: "iconBackgroundGrid",
      title: this.i18n.title,
      position: "right",
      callback: () => {
        let rect = topBarElement.getBoundingClientRect();
        if (rect.width === 0) {
          rect = document.querySelector("#barMore").getBoundingClientRect();
        }
        this.addMenu(rect);
      },
    });
  }

  async openConfig() {
    const dialog = new Dialog({
      title: `${this.i18n.title} - ${this.i18n.setting}`,
      content: `
          <div id="background-grid-dialog" class="b3-dialog__content">
              <div class="b3-dialog-input">
              <label for="mode">${this.i18n.mode}</label>
              <select class="b3-select fn__block" type="input" name="mode" id="mode">
                <option value="content">${this.i18n.content}</option>
                <option value="editor">${this.i18n.editor}</option>
              </select>
              </div>
              <div class="b3-dialog-input">
              <label for="mode">${this.i18n.editable}</label>
              <select class="b3-select fn__block" type="input" name="editable" id="editable">
                <option value="yes">${this.i18n.yes}</option>
                <option value="no">${this.i18n.no}</option>
              </select>
              </div>
              <div class="b3-dialog-input">
              <label for="type">${this.i18n.type}</label>
              <select class="b3-select fn__block" type="input" name="type" id="type">
                <option value="grid">${this.i18n.grid}</option>
                <option value="point">${this.i18n.point}</option>
              </select>
              </div>
              <div class="b3-dialog-input">
              <label for="gridSize">${this.i18n.grid_size}</label>
              <input class="b3-text-field fn__block" type="number" min="1" name="gridSize" id="gridSize"/>
              </div>
              <div class="b3-dialog-input">
              <label for="gridWidth">${this.i18n.grid_width}</label>
              <input class="b3-text-field fn__block" type="number" min="1" name="gridWidth" id="gridWidth"/>
              </div>
              <div class="b3-dialog-input">
              <label for="gridColor">${this.i18n.grid_color}</label>
              <input class="b3-text-field fn__block" type="color" opacity name="gridColor" id="gridColor"/>
              </div>
              <div class="b3-dialog-input">
              <label for="gridOpacity">${this.i18n.grid_opacity}</label>
              <input class="b3-text-field fn__block" type="number" min="0" max="100" name="gridOpacity" id="gridOpacity"/>
              </div>
              
          </div>
          <div class="b3-dialog__action">
          <button class="b3-button b3-button--cancel">${this.i18n.close}</button><div class="fn__space"></div>
          <button class="b3-button b3-button--cancel">${this.i18n.reset}</button><div class="fn__space"></div>
          </div>`,
      width: "520px",
    });
    const mode = dialog.element.querySelector("#mode");
    const editable = dialog.element.querySelector("#editable");
    const type = dialog.element.querySelector("#type");
    const gridSize = dialog.element.querySelector("#gridSize");
    const gridWidth = dialog.element.querySelector("#gridWidth");
    const gridColor = dialog.element.querySelector("#gridColor");
    const gridOpacity = dialog.element.querySelector("#gridOpacity");
    mode.value = this.config.setting.mode;
    mode.addEventListener("change", (e) => {
      const value = e.target.value;
      this.config.setting.mode = value;
      this.apply();
    });
    editable.value = this.config.setting.editable;
    editable.addEventListener("change", (e) => {
      const value = e.target.value;
      this.config.setting.editable = value;
      this.apply();
    });
    type.value = this.config.setting.type;
    type.addEventListener("change", (e) => {
      const value = e.target.value;
      this.config.setting.type = value;
      this.apply();
    });

    gridWidth.value = this.config.setting.width;
    gridWidth.addEventListener("change", (e) => {
      const value = e.target.value;
      this.config.setting.width = value;
      this.apply();
    });
    gridSize.value = this.config.setting.size;
    gridSize.addEventListener("change", (e) => {
      const value = e.target.value;
      this.config.setting.size = value;
      this.apply();
    });
    gridColor.value = this.config.setting.color;
    gridColor.addEventListener("change", (e) => {
      const value = e.target.value;
      this.config.setting.color = value;
      this.apply();
    });
    gridOpacity.value = this.config.setting.opacity;
    gridOpacity.addEventListener("change", (e) => {
      const value = e.target.value;
      this.config.setting.opacity = value;
      this.apply();
    });

    const btnsElement = dialog.element.querySelectorAll(".b3-button");
    btnsElement[0].addEventListener("click", () => {
      dialog.destroy();
    });
    btnsElement[1].addEventListener("click", () => {
      this.resetConfig();
      type.value = this.config.setting.type;
      gridSize.value = this.config.setting.size;
      gridWidth.value = this.config.setting.width;
      gridColor.value = this.config.setting.color;
      gridOpacity.value = this.config.setting.opacity;
    });
  }

  onunload() {
    const id = this.config.styleId;
    const el = document.getElementById(id);
    if (el) {
      el.remove();
    }
  }

  async loadConfig() {
    const config = await this.loadData("config.json");
    if (!config) {
      this.apply();
      return;
    }
    this.config = Object.assign({}, this.config, config);
    this.apply();
  }

  async saveConfig() {
    this.saveData("config.json", JSON.stringify(this.config));
  }

  async resetConfig() {
    this.config = {
      styleId: "background-grid-plugin",
      setting: {
        enabled: true,
        mode: "content",
        type: "grid", // grid or point
        width: 20,
        size: 1,
        color: "#999999",
        opacity: 15,
        editable: "no",
      },
    };
    this.apply();
  }

  async apply() {
    const id = this.config.styleId;
    let result;
    let opacity = parseInt(this.config.setting.opacity, 10);
    if (opacity >= 100) {
      opacity = "";
    }
    let selector;
    if (this.config.setting.mode === "content") {
      selector = ".protyle-wysiwyg";
    } else {
      selector = "";
    }
    const color = this.config.setting.color.startsWith("#")
      ? `${this.config.setting.color}${opacity}`
      : this.config.setting.color;
    let contenteditable='';
    if (this.config.setting.editable === "yes") {
      contenteditable=':has(.protyle-title__input[contenteditable="true"])'
    }
    if (!this.config.setting.enabled) {
      result = "";
    } else if (this.config.setting.type === "grid") {
      result = `.protyle-content${contenteditable} ${selector} {
        background: linear-gradient(90deg, ${color} ${this.config.setting.size}px, transparent 0), linear-gradient(${color} ${this.config.setting.size}px, transparent 0);
        background-size: ${this.config.setting.width}px ${this.config.setting.width}px;
      }`;
    } else {
      result = `.protyle-content${contenteditable} ${selector} {
        background: radial-gradient(circle, ${color} ${this.config.setting.size}px, transparent ${this.config.setting.size}px);
        background-size: ${this.config.setting.width}px ${this.config.setting.width}px;
      }`;
    }
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      el.innerHTML = result;
      document.head.appendChild(el);
    } else {
      el.innerHTML = result;
    }
    this.saveConfig();
  }

  toggleEnabled() {
    this.config.setting.enabled = !this.config.setting.enabled;
    this.apply();
  }

  addMenu(rect) {
    const menu = new Menu("ttsPluginTopBarMenu");
    menu.addItem({
      icon: this.config.setting.enabled ? "iconEyeoff" : "iconEye",
      label: this.config.setting.enabled ? this.i18n.turnOff : this.i18n.turnOn,
      click: () => {
        this.toggleEnabled();
      },
    });
    menu.addItem({
      icon: "iconSettings",
      label: this.i18n.setting,
      click: () => {
        this.openConfig();
      },
    });
    menu.open({
      x: rect.right,
      y: rect.bottom,
      isLeft: true,
    });
  }
}

module.exports = BackgroundGridPlugin;
