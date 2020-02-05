import * as React from 'react';

const isFunc = (f: any): f is Function => Object.prototype.toString.call(f) === '[object Function]';

const initialState = {
    show: false,
}

type State = typeof initialState;

type Props<T extends object = {}> = Partial<{
    children: RenderCb;
    render: RenderCb;
    component: React.ComponentType<(ToggleParams & Partial<T>) | ToggleParams>;
    props: Partial<T>;
}>;


export type ToggleParams = {
    show: State['show'];
    toggle: Togglable['toggle'];
};

type RenderCb = (args: ToggleParams) => JSX.Element;

type Constructor<T = {}> = new (...args: any[]) => T;

const updateShowState = (prevState: State) => ({ show: !prevState.show });

export default class Togglable<T extends object = {}> extends React.Component<Props<T>, State> {
    state: State = initialState;
    static ofType<T extends object>() {
        return Togglable as Constructor<Togglable<T>>;
    }
    render() {
        const { render, children, component: InjectComp, props } = this.props;
        const renderProps = {
            show: this.state.show,
            toggle: this.toggle,
        };

        if(InjectComp) {
            return props ?
                <InjectComp {...renderProps} {...props} />
                :
                <InjectComp {...renderProps} />;
        }

        if(render) {
            return render(renderProps);
        }

        return isFunc(children) ? children(renderProps) : null;
    }

    private toggle = (event: React.MouseEvent<HTMLElement>) => this.setState(updateShowState);
}