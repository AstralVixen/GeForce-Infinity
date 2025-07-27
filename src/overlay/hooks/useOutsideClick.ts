import { useEffect } from "react";

type Handler = (event?: Event) => void;

export const useOutsideClick = (
    ref: React.RefObject<HTMLElement | null>,
    handler: Handler,
    active: boolean = true
) => {
    useEffect(() => {
        if (!active) return;

        const handleMouseDown = (event: MouseEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handler(event);
            }
        };

        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [ref, handler, active]);
};
