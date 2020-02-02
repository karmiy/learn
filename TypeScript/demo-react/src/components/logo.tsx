import * as React from 'react';

interface ILogoProps {
    /**
     * logo 地址
     */
    src: string;
    className?: string;
    alt?: string;
}

const Logo: React.FC<ILogoProps> = (props) => {
    const { className, src, alt } = props;
    return <img className={className} src={src} alt={alt} />
}

export default Logo;