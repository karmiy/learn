import * as React from 'react';
import Logo from './components/logo';
import TodoInput from './components/todo';
import Input from './components/input';
import Button from './components/button';
import Togglable, { ToggleParams } from './components/togglable';
const img = require('./assets/imgs/logo.png');
// import img from './assets/imgs/logo.png';
import './assets/styles/app.scss';


type ITitleProps = {
    name?: string;
} & ToggleParams;

const Title: React.SFC<ITitleProps> = (props) => {
    return (
        <div>
            {props.name}
        </div>
    )
}

const TogglableWithTitle = Togglable.ofType<Omit<ITitleProps, keyof ToggleParams>>();

function App() {
    const ref:React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    return (
        <div className={'app'}>
            <Logo src={img} />
            <TodoInput handleSubmit={() => {}} />
            <Input />
            <Button>按钮</Button>
            <TogglableWithTitle 
                component={Title}
                props={{name: '1'}}
            />
        </div>
    )
}

export default App;