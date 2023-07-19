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
    type: "grid", // grid or point
    width: 20,
    color: "rgba(187, 187, 187, 0.1)",
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

  openConfig() {
    const dialog = new Dialog({
      title: `${this.i18n.title} - ${this.i18n.setting}`,
      content: `
          <div class="b3-dialog__content">
          <div class="b3-dialog-input">
              <label for="type">${this.i18n.type}</label>
              <select class="b3-select fn__block" type="input" name="type" id="type" placeholder="25">
                <option value="grid">${this.i18n.grid}</option>
                <option value="point">${this.i18n.point}</option>
              </select>
              </div>
              <div class="b3-dialog-input">
              <label for="gridSize">${this.i18n.grid_size}</label>
              <input class="b3-text-field fn__block" type="input" name="gridSize" id="gridSize" placeholder="25"/>
              </div>
              <div class="b3-dialog-input">
              <label for="gridColor">${this.i18n.grid_color}</label>
              <input class="b3-text-field fn__block" type="input" name="gridColor"  id="gridColor" placeholder="rgba(187, 187, 187, 0.1)"/>
              </div>
          </div>
          <div class="b3-dialog__action">
              <button class="b3-button b3-button--cancel">${this.i18n.close}</button><div class="fn__space"></div>
          </div>`,
      width: "520px",
    });
    const type = dialog.element.querySelector("#type");
    const gridSize = dialog.element.querySelector("#gridSize");
    const gridColor = dialog.element.querySelector("#gridColor");
    type.value = this.config.setting.type;
    type.addEventListener("change", (e) => {
      const value = e.target.value;
      this.config.setting.type = value;
      this.apply();
    });

    gridSize.value = this.config.setting.width;
    gridSize.addEventListener("change", (e) => {
      const value = e.target.value;
      this.config.setting.width = parseInt(value, 10);
      this.apply();
    });
    gridColor.value = this.config.setting.color;
    gridColor.addEventListener("change", (e) => {
      const value = e.target.value;
      this.config.setting.color = value;
      this.apply();
    });

    const btnsElement = dialog.element.querySelectorAll(".b3-button");
    btnsElement[0].addEventListener("click", () => {
      dialog.destroy();
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
    this.config = config;
    this.apply();
  }

  async saveConfig() {
    this.saveData("config.json", JSON.stringify(this.config));
  }

  async apply(name) {
    const id = this.config.styleId;
    let result;
    if (this.config.setting.type === "grid") {
      result = `.protyle-wysiwyg {
        background: linear-gradient(90deg, ${this.config.setting.color} 3%, transparent 0), linear-gradient(${this.config.setting.color} 3%, transparent 0);
        background-size: ${this.config.setting.width}px ${this.config.setting.width}px;
      }`;
    } else {
      result = `.protyle-wysiwyg {
        background: radial-gradient(circle, ${this.config.setting.color} 1px, transparent 1px);
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

    this.config.current = name;
    this.saveConfig();
  }

  addMenu(rect) {
    const menu = new Menu("ttsPluginTopBarMenu");
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
