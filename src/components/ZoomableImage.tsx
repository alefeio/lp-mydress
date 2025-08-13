import { useRef, useState } from "react";

interface ZoomableImageProps {
    src: string;
    alt: string;
    lensSize?: number;
    zoomFactor?: number;
    onZoomChange?: (zoomActive: boolean) => void;
}

export function ZoomableImage({
    src,
    alt,
    lensSize = 500,
    zoomFactor = 2,
    onZoomChange,
}: ZoomableImageProps) {
    const [showLens, setShowLens] = useState(false);
    const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
    const zoomImgRef = useRef<HTMLImageElement | null>(null);

    // Calcula a posição da lente e evita que saia do container da imagem
    const calculateLensPosition = (x: number, y: number) => {
        const img = zoomImgRef.current;
        if (!img) return { x, y };

        const rect = img.getBoundingClientRect();

        // Coordenadas relativas dentro da imagem
        let posX = x - rect.left;
        let posY = y - rect.top;

        // Limitar posição para não ultrapassar bordas
        if (posX < lensSize / (2 * zoomFactor)) posX = lensSize / (2 * zoomFactor);
        if (posY < lensSize / (2 * zoomFactor)) posY = lensSize / (2 * zoomFactor);
        if (posX > rect.width - lensSize / (2 * zoomFactor))
            posX = rect.width - lensSize / (2 * zoomFactor);
        if (posY > rect.height - lensSize / (2 * zoomFactor))
            posY = rect.height - lensSize / (2 * zoomFactor);

        return { x: posX, y: posY };
    };

    const toggleZoom = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        setShowLens((prev) => {
            onZoomChange?.(!prev);
            return !prev;
        });
    };

    const closeZoom = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowLens(false);
        onZoomChange?.(false);
    };

    const handleMove = (
        e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
        if (!showLens) return;

        if ("touches" in e) {
            const touch = e.touches[0];
            if (!touch) return;
            const pos = calculateLensPosition(touch.clientX, touch.clientY);
            setLensPos(pos);
            e.preventDefault();
        } else {
            const pos = calculateLensPosition(e.clientX, e.clientY);
            setLensPos(pos);
        }
    };

    return (
        <div
            className="relative flex justify-center items-center flex-grow bg-background-50 rounded-b-xl cursor-zoom-in"
            onClick={toggleZoom}
            onMouseMove={handleMove}
            onTouchMove={handleMove}
            onTouchStart={toggleZoom}
            role="presentation"
        >
            <button
                // onClick={() => onOpenModal(actualIndex, collectionKey)}
                className="flex gap-2 absolute bottom-2 cursor-pointer text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition"
                aria-label="Ver produto"
            >
                {/* <span></span> */}
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="white"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                    />
                </svg>
            </button>
            <img
                ref={zoomImgRef}
                src={src}
                alt={alt}
                className="max-w-full max-h-[70vh] object-contain select-none"
                draggable={false}
                onClick={(e) => e.stopPropagation()}
            />

            {showLens && (
                <div
                    onClick={closeZoom}
                    className="absolute rounded-full border border-gray-300 shadow-lg cursor-zoom-out"
                    style={{
                        width: lensSize,
                        height: lensSize,
                        top: lensPos.y - lensSize / 2,
                        left: lensPos.x - lensSize / 2,
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: `${(zoomImgRef.current?.width || 0) * zoomFactor
                            }px ${(zoomImgRef.current?.height || 0) * zoomFactor}px`,
                        backgroundPosition: `-${lensPos.x * zoomFactor - lensSize / 2}px -${lensPos.y * zoomFactor - lensSize / 2
                            }px`,
                        zIndex: 40,
                        pointerEvents: "auto",
                    }}
                    title="Clique para ocultar o zoom"
                />
            )}
        </div>
    );
}
