class XiaomiPurifier extends HTMLElement {
  _t(str) {
    const chinese = {
      'Good': '优',
      'Moderate': '良',
      'Mild Unhealthy': '轻度污染',
      'Unhealthy': '中度污染',
      'Very Unhealthy': '重度污染',
      'Hazardous': '严重污染',

      'Air Purifier': '空气净化器',

      'On': '开启',
      'Off': '关闭',

      'Set speed': '设置速度',
      'Device turned on': '开启设备',
      'Device turned off': '关闭设备',
      'Indoor AQ': '室内空气',

      'Auto': '自动',
      'Silent': '睡眠',
      'Favorite': '最爱',

      'Temperature': '温度',
      'Humidity': '湿度'
    }
    if (!this.config) return str;
    const translate = this.config.translate || (() => {
      return this.config.language === 'chs' ? chinese : null;
    })() || {};
    if (typeof translate[str] === 'string') {
      return translate[str];
    }
    return str;
  }

  constructor() {
    super()
    this.fan_mode = {
      'auto': '自动模式',
      'silent': '睡眠模式',
      'favorite': '最爱模式'
    }
    const shadow = this.attachShadow({ mode: 'open' });
    const div = document.createElement('ha-card');
    div.className = 'ha-air-filter-panel off'
    div.innerHTML = `
            // <div class="card-header">
            //     <a class="name">
            //         <ha-icon icon="mdi:air-filter"></ha-icon>
            //         <span class="title">空气净化器</span>
            //     </a>
            //     <paper-icon-button id="buzzer" icon="mdi:volume-low" style="margin-top:-8px;"></paper-icon-button>
            //     <paper-icon-button id="more" icon="mdi:menu" style="margin-top:-8px;"></paper-icon-button>
            // </div>
            <div class="duang">
            <div class="body">
                <div class="content">
                  <p>PM2.5(μg/m³)</p>
                  <p class="var-aqi">38</p>
                  <p><span data-title="Indoor AQ">室内空气</span> <span class="var-quality">优</span></p>
                  <p><span class="temperature"><ha-icon icon="mdi:home-thermometer-outline"></ha-icon><b>26</b>&#8451;</span><span class="humidity"><ha-icon icon="mdi:water-percent"></ha-icon><b>35</b>%</span></p>
                </div>
                <div class="content-bg">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
            </div>
            </div>
            <div class="tmp-body hide">
                <div>
                  <span>40</span>
                  <p><span data-title="Temperature">温度</span> (℃)</p>
                </div>
                <div>
                  <span>50</span>
                  <p><span data-title="Humidity">湿度</span> (%)</p>
                </div>
            </div>
            <div class="footer">
              <div class="status">
                <span ><ha-icon icon="mdi:power" ></ha-icon></span>
                <p>开机</p>
              </div>
              <div>
              <span><ha-icon icon="mdi:brightness-auto" ></ha-icon></span>
                <p data-title="Auto">自动</p>
              </div>
              <div>
              <span><ha-icon icon="mdi:power-sleep" ></ha-icon></span>
                <p data-title="Silent">睡眠</p>
              </div>
              <div>
              <span><ha-icon icon="mdi:heart" ></ha-icon></span>
                <p data-title="Favorite">最爱</p>
              </div>
              <div class="favorite-level hide">
                <div><output>3</output><span class="icon-button"><ha-icon icon="mdi:chevron-down"></ha-icon></span><input type="range" min="0" max="16" /></div>
              </div>
            </div>
            <div>
            </div>
        `
    shadow.appendChild(div)

    const style = document.createElement('style')
    style.textContent = `
            .ha-air-filter-panel{overflow:hidden;}
            .card-header{display:flex;justify-content: space-between;}
            .card-header .name{cursor: pointer;text-decoration: none;flex-grow: 1;}
            .content-bg{
              height: 250px;
              width: 250px;
              border-radius: 50%;}
            .content-bg div{position:absolute;height: 260px;width: 240px;border-radius: 50%;}
            .content-bg div:nth-child(1){
              transform: rotate(0deg);
              animation: a1 5s linear 2s infinite alternate;
            }
            .content-bg div:nth-child(2){
              transform: rotate(60deg);
              animation: a2 4s linear 1s infinite alternate;
            }
            .content-bg div:nth-child(3){
              transform: rotate(120deg);
              animation: a3 3s linear 1s infinite alternate;
            }

            @keyframes a1{
              from {transform: rotate(0deg);}
              to {transform: rotate(360deg);}
            }
            @keyframes a2{
              from {transform: rotate(60deg);}
              to {transform: rotate(300deg);}
            }
            @keyframes a3{
              from {transform: rotate(120deg);}
              to {transform: rotate(240deg);}
            }

            .content{width:240px;height:240px;position:absolute;border-radius: 50%;margin-top:10px;z-index:1;text-align: center;}
            .content p{padding:0;margin:0;}
            .content p:nth-child(1){padding-top: 50px;font-size:12px;color:#ddd;}
            .content p:nth-child(1).advanced{padding-top: 70px !important;}
            .content p:nth-child(2){font-size:80px;color:white; /*margin: 40px 0;*/ line-height: 90px;}
            .content p:nth-child(3){color:#eee;}
            .content p:nth-child(4) {padding-top: 30px;}
            .content p:nth-child(4) span{color: white; }
            .content p:nth-child(4) span b{font-weight: normal;font-size: 2em; padding:0 3px;}
            .content p:nth-child(4) span ha-icon{margin-top: -10px; color: rgba(255,255,255,0.7);}
            .content p:nth-child(4) span:first-of-type{margin-right:10px;}
            .content p:nth-child(4) span:last-of-type{margin-left:10px;}

            .body{width: 250px;margin: 0 auto;}
            .tmp-body{display:flex;padding:30px 0;}
            .tmp-body div{flex:1;}
            .tmp-body div span:not([data-title]){font-size:40px;}
            .tmp-body div p{margin:0;font-size:12px;color:gray;}
            .tmp-body div:nth-child(1){text-align:right;border-right:1px solid silver;padding-right:20px;}
            .tmp-body div:nth-child(2){padding-left:20px;}
            .footer{display:flex;}
            .footer div{flex:1;text-align:center;}
            .footer div ha-icon{font-size:25px;cursor:pointer;}
            .footer div span{display:inline-block;border:1px solid silver;padding:10px;border-radius:50%;text-align:center;}
            .footer div p{color: var(--secondary-text-color); /*gray;*/}
            .footer div.favorite-level{height:94px;}
            .footer div.favorite-level div{padding:10px; }
            .footer div.favorite-level input[type="range"] {width: 100%;  margin-top:20px;}
            .footer div.favorite-level .icon-button {float: right; width: 26px; height: 26px; display: block; cursor: pointer;border:none;padding:initial;}

            .hide{display: none;}


            /**开机**/
            .on .content-bg div{background: rgba(1,182,165,.1);}
            .on .content{background:#01b6a5;  overflow:hidde;}
            .on.ledoff .content{background:  rgba(0,0,0,0.9) !important;}
            .on .footer .status span{background:#f44336;color:white;}
            .on .footer .status p{var(--primary-text-color); /*#222;*/}
            .on .footer div.active span{background:#01b6a5;color:white;}
            .on .footer div.active p{color: var(--primary-text-color); /*#222;*/}
            .on .tmp-body div span:not([data-title]){color:#01b6a5;}

            /**空气状态**/
            .on .level-1{background-color:#01be9e;}
            .on .level-2{background-color:#01be9e;}
            .on .level-3{background-color:#01be9e;}
            .on .level-4{background-color:blue;}
            .on .level-5{background-color:red;}
            .on .level-6{background-color:red;}

            /**关机**/
            .off .content-bg div{background: rgba(0,0,0,.1);}
            .off .content{background:#607d8b;overflow:hidden;}
            .off .footer div{color:gray!important;}
            .off .footer .status span{background:#01b6a5;color:white;}
            .off .footer .status p{color:#222;}
        `
    shadow.appendChild(style);

    let holdStarter = null;
    let holdDelay = 500;

    this.shadow = shadow
    const $ = this.shadow.querySelector.bind(this.shadow)
    const $$ = this.shadow.querySelectorAll.bind(this.shadow);
    this.$ = $
    this.$$ = $$;
    // 开-关机
    $('.footer div:nth-child(1) span').onclick = () => {
      let ls = $('.ha-air-filter-panel').classList
      if (ls.contains('off')) {
        ls.remove('off')
        ls.add('on')
        this.toast(this._t('Device turned on'));
        this.duang()
      } else {
        ls.remove('on')
        ls.add('off')
        this.toast(this._t('Device truned off'));
      }
      this.call('toggle')
    }
    // 自动
    $('.footer div:nth-child(2) span').onclick = this.set_speed.bind(this, 'Auto')
    // 睡眠
    $('.footer div:nth-child(3) span').onclick = this.set_speed.bind(this, 'Silent')
    // 最爱
    // $('.footer div:nth-child(4) span').onclick = this.set_speed.bind(this, 'Favorite')
    $('.footer div:nth-child(4)').addEventListener(('ontouchstart' in document.documentElement ? 'touchstart' : 'mousedown'), (e) => {
      holdStarter = setTimeout(() => {
        holdStarter = null;
        // holding...

        if (!$('.footer div:nth-child(4)').classList.contains('active')) return;
        [].forEach.call($$('.footer>div:not(.favorite-level)'), el => {
          el.classList.toggle('hide');
        });
        $('.footer div.favorite-level').classList.toggle('hide');
      }, holdDelay);
    });
    $('.footer div:nth-child(4)').addEventListener(('ontouchend' in document.documentElement ? 'touchend' : 'mouseup'), () => {
      if (holdStarter) {
        clearTimeout(holdStarter);
        holdStarter = null;
        // clicked;
        this.set_speed('Favorite');
      }
    });
    $('.footer div.favorite-level .icon-button').onclick = () => {
      [].forEach.call($$('.footer>div:not(.favorite-level)'), el => {
        el.classList.toggle('hide');
      });
      $('.footer div.favorite-level').classList.toggle('hide');
    }
    $('.footer div.favorite-level input[type="range"]').oninput = (e) => {
      $('.footer div.favorite-level output').value = e.target.value;

    }
    $('.footer div.favorite-level input[type="range"]').onchange = (e) => {
      $('.footer div.favorite-level output').value = e.target.value;
      // set favorite level
      this.callMIIO('set_favorite_level', {
        level: e.target.value,
      })
    }
    // 更多
    $('.card-header paper-icon-button#more').onclick = () => {
      const entityId = this.config.entity;
      this.fire('hass-more-info', { entityId })
    }
    // turn on/off buzzer
    $('.card-header paper-icon-button#buzzer').onclick = (e) => {
      const buzzer = e.target.getAttribute('icon') === 'mdi:volume-low';
      this.callMIIO(buzzer ? 'set_buzzer_off' : 'set_buzzer_on', {});
    }
    // switch led
    let clickStarter = null;
    $('.body .content').onclick = (e) => {
      if (clickStarter) {
        clearTimeout(clickStarter);
        clickStarter = null;
        const isoff = $('.ha-air-filter-panel').classList.contains('ledoff');
        this.callMIIO(isoff ? 'set_led_on' : 'set_led_off', {});
        return;
      }
      clickStarter = setTimeout(() => {
        clickStarter = null;
      }, 200);

    }
  }

  // 特效
  duang() {
    const { $ } = this
    if ($('.duang .lizi')) return;
    let arr = []
    let f = document.createDocumentFragment()
    // 左边
    for (let i = 0; i < 20; i++) {
      let s = Math.round(Math.random() * 5) + 5
      let y = Math.round(Math.random() * 300)
      let kf = `dust-y${y}`
      let span = document.createElement('span')
      span.className = 'lizi'
      span.style.cssText = `animation: ${kf} ${s}s linear 1s infinite;left:-5px; margin-top:${y}px;`

      if (!arr.includes(kf)) {
        arr.push(`@keyframes ${kf}{from {left:0; margin-top:${y}px;}to {left:50%; margin-top:200px;}}`)
      }
      f.appendChild(span)
    }
    // 右边
    for (let i = 0; i < 20; i++) {
      let s = Math.round(Math.random() * 5) + 5
      let y = Math.round(Math.random() * 300)
      let kf = `dust-x${y}`
      let span = document.createElement('span')
      span.className = 'lizi'

      span.style.cssText = `animation: ${kf} ${s}s linear 1s infinite;right:-5px; margin-top:${y}px;`
      if (!arr.includes(kf)) {
        arr.push(`@keyframes ${kf}{from {right:0; margin-top:${y}px;}to {right:50%; margin-top:200px;}}`)
      }

      f.appendChild(span)
    }
    // 样式
    let style = document.createElement('style')
    style.textContent = `
      /**灰尘**/
      .duang{position: relative;overflow:hidden;padding-bottom:10px;}
      .duang .lizi{
        display:block;
        width:3px;height:3px;
        border-radius:50%;
        background-color: #01b6a5;
        position: absolute;
      }
      .off .duang .lizi{display: none;}
      ${arr.join('')}`
    f.appendChild(style)
    $('.duang').insertBefore(f, $('.body'))
  }

  // 设置速度
  set_speed(speed) {
    this.toast(`${this._t('Set speed')}【${speed}】`)
    this.call('set_speed', { speed })
  }

  // 通知
  toast(message) {
    this.fire("hass-notification", { message })
  }

  // 触发事件
  fire(type, data) {
    const event = new Event(type, {
      bubbles: true,
      cancelable: false,
      composed: true
    });
    event.detail = data;
    document.querySelector('home-assistant').dispatchEvent(event);
  }

  // 服务
  call(name, data = {}) {
    this.log('call service: ', name, data);
    const entity_id = this.config.entity;
    this._hass.callService('fan', name, {
      entity_id,
      ...data
    })
  }

  callMIIO(name, data = {}) {
    this.log('call miio service: ', name, data);
    const entity_id = this.config.entity;
    if (this._hass.services.xiaomi_miio) {
      this._hass.callService('xiaomi_miio', `fan_${name}`, {
        entity_id,
        ...data
      })
    } else {
      this._hass.callService('fan', `xiaomi_miio_${name}`, {
        entity_id,
        ...data
      })
    }
  }

  update({ title, mode, aqi, filter_life_remaining, temperature, humidity, state, favorite_level, buzzer, ledon }) {
    const { $, $$ } = this

    // 开启&关闭
    let ls = $('.ha-air-filter-panel').classList
    if (state === 'on' && ls.contains('off')) {
      ls.remove('off')
      ls.add('on')
      $('.footer div:nth-child(1) p').textContent = this._t('Off');
      this.duang();
    } else if (state === 'off' && ls.contains('on')) {
      ls.remove('on')
      ls.add('off')
      $('.footer div:nth-child(1) p').textContent = this._t('On');
    }
    $('.title').textContent = title

    if (ls.contains('ledoff') && ledon) {
      ls.remove('ledoff');
    } else if (ledon === false && !ls.contains('ledoff')) {
      ls.add('ledoff');
    }
    // 温湿度
    if (this.config.advanced === true) {
      $('.tmp-body div:nth-child(1) span').textContent = temperature
      $('.tmp-body div:nth-child(2) span').textContent = humidity
    }
    $('.content p:nth-child(4) .temperature b').textContent = temperature;
    $('.content p:nth-child(4) .humidity b').textContent = humidity;

    // 质量
    let qls = $('.content').classList
    qls.remove('level-1', 'level-2', 'level-3', 'level-4', 'level-5', 'level-6')
    let quality = 'Good';
    if (aqi < 50) {
      quality = 'Good'
      qls.add('level-1')
    }
    else if (aqi < 100) {
      quality = 'Moderate'
      qls.add('level-2')
    }
    else if (aqi < 150) {
      quality = 'Mild Unhealthy'
      qls.add('level-3')
    }
    else if (aqi < 200) {
      quality = 'Unhealthy'
      qls.add('level-4')
    }
    else if (aqi < 300) {
      quality = 'Very Unhealthy'
      qls.add('level-5')
    }
    else {
      quality = 'Hazardous'
      qls.add('level-6')
    }
    $('.var-quality').textContent = this._t(quality);
    $('.var-aqi').textContent = aqi
    // 模式
    let mls2 = $('.footer div:nth-child(2)').classList
    let mls3 = $('.footer div:nth-child(3)').classList
    let mls4 = $('.footer div:nth-child(4)').classList
    mls2.remove('active')
    mls3.remove('active')
    mls4.remove('active')
    if (mode == 'auto') {
      mls2.add('active')
    } else if (mode == 'silent') {
      mls3.add('active')
    } else if (mode == 'favorite') {
      mls4.add('active')
    }
    // 最爱模式风扇速度
    if (favorite_level) {
      $('.footer div.favorite-level input[type="range"]').value = favorite_level;
      $('.footer div.favorite-level input[type="range"]').dispatchEvent(new Event('input', {
        bubbles: true,
        cancelable: true
      }));
    }
    // buzzer
    $('.card-header paper-icon-button#buzzer').setAttribute('icon', buzzer ? 'mdi:volume-low' : 'mdi:volume-variant-off');
  }

  set hass(hass) {
    this._hass = hass
    const entityId = this.config.entity;
    const title = this.config.title;
    const state = hass.states[entityId];
    const attrs = state.attributes;
    if (this.config.advanced === true) {
      this.shadow.querySelector('.tmp-body').classList.remove('hide');
      this.shadow.querySelector('.content p:nth-child(1)').classList.add('advanced');
      this.shadow.querySelector('.content p:nth-child(4)').classList.add('hide');
    }
    if (state) {
      this.update({
        title: title || attrs['friendly_name'] || this._t('Air Purifier'),
        mode: attrs['mode'] || '',
        aqi: attrs['pm25_density'] || 0,
        filter_life_remaining: attrs['filter_life_level'] || 0,
        temperature: attrs['indoor_temperature'] || 0,
        humidity: attrs['relative_humidity'] || 0,
        state: state.state,
        filter_hours_used: attrs['filter_used_time'] || 0,
        purify_volume: attrs['purify_volume'] || 0,
        led: attrs['indicator_light'] ? this._t('On') : this._t('Off'),
        favorite_level: attrs['favorite_fan_level'],
        buzzer: attrs['buzzer'] || false,
        ledon: attrs['indicator_light'] || false,
      })
    }
  }
  // 加入日志开关l
  log() {

    //      console.log(...arguments)
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('你需要定义一个实体\n entity: 实体');
    }
    this.config = config;
    const elems = this.shadow.querySelectorAll('[data-title]');
    [].forEach.call(elems, (e) => {
      e.innerText = this._t(e.getAttribute('data-title'));
    });
  }

  getCardSize() {
    return 2;
  }
}

customElements.define('xiaomi-purifier', XiaomiPurifier);
