import * as React from 'react';

interface InputSetting {
    placeholder: string
    maxlength: number
}

const defaultProps = {
    autoFocus: false,
    inputSetting: {
        placeholder: '请输入',
        maxlength: 10,
    }
}

class IInputProps {
    public autoFocus?: boolean;
    public inputSetting?: InputSetting;
}

interface IInputState {
    value: string;
}

const createPropsGetter = <DP extends object>(defaultProps: DP) => {
    return <P extends Partial<DP>>(props: P) => {
        type PropsExcludingDefaults = Omit<P, keyof DP>;
        type RecomposedProps = DP & PropsExcludingDefaults;

        return (props as any) as RecomposedProps
    }
}

const getProps = createPropsGetter(defaultProps);

export default class Input extends React.Component<IInputProps, IInputState> {
    public static defaultProps = new IInputProps();
    state = {
        value: '',
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            value: e.target.value,
        })
    }

    render() {
        const { autoFocus, inputSetting } = getProps(this.props);
        return (
            <div>
                <input 
                    type="text" 
                    value={this.state.value} 
                    onChange={this.onChange}
                    maxLength={inputSetting.maxlength}
                    placeholder={inputSetting.placeholder}
                />
            </div>
        )
    }
}