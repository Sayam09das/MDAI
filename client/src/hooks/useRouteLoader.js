import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useRouteLoader = (delay = 500) => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setLoading(false);
        }, delay);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return loading;
};

export default useRouteLoader;
