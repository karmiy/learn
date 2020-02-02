import * as React from 'react';

interface ITodoInputProps {
    handleSubmit: (value: string) => void
}

interface ITodoInputState {
    itemText: string
}

export default class TodoInput extends React.Component<ITodoInputProps, ITodoInputState> {
    constructor(props: ITodoInputProps) {
        super(props);
        this.state = {
            itemText: '',
        }
    }

    private updateValue = (value: string) => {
        this.setState({ itemText: value })
    }
    
    render() {
        return (
            <div>
                {this.state.itemText}
            </div>
        )
    }
}