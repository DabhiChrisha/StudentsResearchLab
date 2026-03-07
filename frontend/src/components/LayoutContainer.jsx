/**
 * LayoutContainer — Shared responsive container for all page-level layouts.
 * Caps content width at max-w-screen-2xl, centers it, and applies consistent horizontal padding.
 * Prevents ultra-wide stretch on 2560px+ displays.
 */
export default function LayoutContainer({ children, className = "" }) {
    return (
        <div className={`max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </div>
    );
}
