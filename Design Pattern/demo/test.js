class Light {
    constructor() {
        this.state = 'off';
        this.button = null;
    }
    init() {
        const button = document.createElement('button');
        button.innerHTML = '开关';
        this.button = document.body.appendChild(button);

        this.button.onclick = () => this.buttonWasPressed();
    }
    buttonWasPressed() {
        if (this.state === 'off') {
            console.log('开灯');
            this.state = 'on';
        } else if (this.state === 'on') {
            console.log('关灯');
            this.state = 'off';
        }
    }
}

const light = new Light();
light.init();