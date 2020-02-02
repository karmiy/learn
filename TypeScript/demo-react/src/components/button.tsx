import * as React from 'react';

interface IButtonProps {
    className?: string;
    type?: string;
}

const Button: React.SFC<IButtonProps> = props => {
    const {
        className,
        type,
        children
    } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    let classNames = 'km-button';

    className && (classNames += ' ' + className);

    return (
        <div className={classNames}>
            <button>{children}</button>
        </div>
    )
}

export default Button;