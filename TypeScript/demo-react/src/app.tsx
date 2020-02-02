import * as React from 'react';
import Logo from './components/logo';
import TodoInput from './components/todo';
import Input from './components/input';
import Button from './components/button';

function App() {
    return (
        <div>
            <Logo src={require('./assets/imgs/logo.png')} />
            <TodoInput handleSubmit={() => {}} />
            <Input />
            <Button>按钮</Button>
        </div>
    )
}

export default App;