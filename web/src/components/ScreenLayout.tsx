import type { ReactNode } from 'react';
import './ScreenLayout.scss';

type Props = {
    className?: string;
    header?: ReactNode;
    main: ReactNode;
    footer?: ReactNode;
    onClick?: () => void;
};

export default function ScreenLayout({ className, header, main, footer, onClick }: Props) {
    return (
        <div className={`screen-layout ${className || ''}`} onClick={onClick}>
            {header && <header>{header}</header>}
            <main>{main}</main>
            {footer && <footer>{footer}</footer>}
        </div>
    );
}
