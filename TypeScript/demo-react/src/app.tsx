import * as React from 'react';
import Logo from './components/logo';
import TodoInput from './components/todo';
import Input from './components/input';
import Button from './components/button';
import Togglable, { ToggleParams } from './components/togglable';
import TodoItem from './components/todo-item';
const img = require('./assets/imgs/logo.png');
// import img from './assets/imgs/logo.png';
import './assets/styles/app.scss';
import { Provider } from 'react-redux';
import store from './store';
import useController from './hooks/useController';

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
    const [value, setValue] = useController('');

    // const ref:React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    return (
        <div className={'app'}>
            {/* <Logo src={img} />
            <TodoInput handleSubmit={() => {}} />
            <Input />
            <Button>按钮</Button>
            <TogglableWithTitle 
                component={Title}
                props={{name: '1'}}
            /> */}
            <Provider store={store}>
                <TodoItem />
            </Provider>
        </div>
    )
}

export default App;