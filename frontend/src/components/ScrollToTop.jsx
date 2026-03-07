import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        const scrollContainer = document.getElementById('main-content');
        if (scrollContainer) {
            scrollContainer.scrollTo(0, 0);
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return null;
}
