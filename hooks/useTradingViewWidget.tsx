'use client';
import { useEffect, useRef } from "react";

const useTradingViewWidget = (scriptUrl: string, config: Record<string, unknown>, height = 600) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        if (initializedRef.current) return;

        const widgetContainer = document.createElement("div");
        widgetContainer.className = "tradingview-widget-container__widget";
        widgetContainer.style.width = "100%";
        widgetContainer.style.height = `${height}px`;
        container.replaceChildren(widgetContainer);

        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;
        script.type = "text/javascript";
        script.text = JSON.stringify(config);

        container.appendChild(script);
        container.dataset.loaded = "true";
        initializedRef.current = true;

        // Do not teardown the widget script in cleanup.
        // TradingView's pending script may still execute in React StrictMode.
    }, [scriptUrl, config, height]);

    return containerRef;
}
export default useTradingViewWidget