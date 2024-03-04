import React, { useState } from 'react';
type ImageProps = {
    src: string,
    alt?: string
    className?: string
    style?: any;
    height?: number;
    width?: number
    onClick?: React.MouseEventHandler<HTMLImageElement>
}
const Image = ({ src,
    alt,
    className,
    style,
    height,
    width,
    onClick
}: ImageProps) => {
    const fallbackSrc = '/assets/images/profile.png'
    const [imageSrc, setImageSrc] = useState(src);
    const [error, setError] = useState(false);

    const onError = () => {
        if (fallbackSrc && !error) {
            setImageSrc(fallbackSrc);
            setError(true);
        }
    };

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            style={style}
            onError={onError}
            width={width}
            height={height}
            onClick={onClick}
        />
    );
};

export default Image;
