import * as React from 'react';
import Logo from './components/logo';
import TodoInput from './components/todo';
import Input from './components/input';
import Button from './components/button';
import Togglable, { ToggleParams } from './components/togglable';

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
    return (
        <div>
            <Logo src={require('./assets/imgs/logo.png')} />
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