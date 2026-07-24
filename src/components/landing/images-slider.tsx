import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ImagesSliderProps {
    images: string[];
    children: React.ReactNode;
    overlay?: boolean;
    overlayClassName?: string;
    className?: string;
    autoplay?: boolean;
    direction?: "up" | "down";
}

export function ImagesSlider({
    images,
    children,
    overlay = true,
    overlayClassName,
    className,
    autoplay = true,
    direction = "up",
}: ImagesSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState<string[]>([]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex + 1 === images.length ? 0 : prevIndex + 1
        );
    }, [images.length]);

    const handlePrevious = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
        );
    }, [images.length]);

    const loadImages = useCallback(() => {
        if (images.length === 0) {
            setLoadedImages([]);
            return;
        }
        const loadPromises = images.map((image) => {
            return new Promise<string>((resolve, reject) => {
                const img = new Image();
                img.src = image;
                img.onload = () => resolve(image);
                img.onerror = reject;
            });
        });

        Promise.all(loadPromises)
            .then((loadedImages) => {
                setLoadedImages(loadedImages);
            })
            .catch((error) => console.error("Failed to load images", error));
    }, [images]);

    useEffect(() => {
        loadImages();
    }, [loadImages]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") {
                handleNext();
            } else if (event.key === "ArrowLeft") {
                handlePrevious();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        let interval: ReturnType<typeof setInterval> | undefined;
        if (autoplay) {
            interval = setInterval(() => {
                handleNext();
            }, 5000);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            if (interval) clearInterval(interval);
        };
    }, [autoplay, handleNext, handlePrevious]);

    const slideVariants: Variants = {
        initial: {
            scale: 0,
            opacity: 0,
            rotateX: 45,
        },
        visible: {
            scale: 1,
            rotateX: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeInOut",
            },
        },
        upExit: {
            opacity: 1,
            y: "-150%",
            transition: {
                duration: 1,
            },
        },
        downExit: {
            opacity: 1,
            y: "150%",
            transition: {
                duration: 1,
            },
        },
    };

    const areImagesLoaded = loadedImages.length > 0;

    return (
        <div
            className={cn(
                "overflow-hidden h-full w-full relative flex items-center justify-center bg-slate-950",
                className
            )}
            style={{
                perspective: "1000px",
            }}
        >
            {children}
            {overlay && (
                <div
                    className={cn("absolute inset-0 bg-black/60 z-40", overlayClassName)}
                />
            )}

            {areImagesLoaded && (
                <AnimatePresence>
                    <motion.img
                        key={currentIndex}
                        src={loadedImages[currentIndex]}
                        initial="initial"
                        animate="visible"
                        exit={direction === "up" ? "upExit" : "downExit"}
                        variants={slideVariants}
                        className="image h-full w-full absolute inset-0 object-cover object-center"
                    />
                </AnimatePresence>
            )}
        </div>
    );
}
