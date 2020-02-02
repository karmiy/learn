import * as hoistNonReactStatics from 'hoist-non-react-statics'
import * as React from 'react'

const hocProps = {
    setting: {
        maxLength: 30,
        placeholder: '请输入',
    }
}

type InjectProps = Partial<typeof hocProps>;

const withTodoInput = <P extends InjectProps>(UnwrappedComponent: React.ComponentType<P>) => {
    type Props = Omit<P, keyof InjectProps>;

    class WithToggleable extends React.Component<Props> {
        public static readonly UnwrappedComponent = UnwrappedComponent;

        public render() {
            return (
                <UnwrappedComponent 
                    setting={hocProps}
                    {...this.props as P}
                />
            )
        }
    }

    return hoistNonReactStatics(WithToggleable, UnwrappedComponent)
}

// export default withTodoInput;