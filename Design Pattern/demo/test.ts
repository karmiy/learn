namespace Test {
    abstract class State {
        light: Light;
        constructor(light) {
            this.light = light;
        }
        abstract buttonWasPressed(): void;
    }

    class OffLightState extends State {
        buttonWasPressed() {
            console.log('弱光');
            this.light.setState(this.light.weakLightState);
        }
    }
    
    class WeakLightState extends State {
        buttonWasPressed() {
            console.log('强光');
            this.light.setState(this.light.strongLightState);
        }
    }
    
    class StrongLightState extends State {
        buttonWasPressed() {
            console.log('关灯');
            this.light.setState(this.light.offLightState);
        }
    }

    class Light {
        offLightState: OffLightState;
        weakLightState: WeakLightState;
        strongLightState: StrongLightState;
        button: HTMLButtonElement = null;
        currState: State = null;
        constructor() {
            this.offLightState = new OffLightState(this);
            this.weakLightState = new WeakLightState(this);
            this.strongLightState = new StrongLightState(this);
        }
        init() {
            const button = document.createElement('button');
            button.innerHTML = '开关';
            this.button = document.body.appendChild(button);
    
            this.currState = this.offLightState; // 设置当前状态
            this.button.onclick = () => this.currState.buttonWasPressed();
        }
        setState(state: State) {
            this.currState = state;
        }
    }
}