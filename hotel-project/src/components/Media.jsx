
export default function Media({ src, alt = "", className = "" }) {
    if (!src) return null;

    const path = typeof src === "string" ? src : src?.src;

    const isVideo = path?.match(/\.(mp4|mov|webm)$/i);
    const isGif = path?.endsWith(".gif");
    const isImage = path?.match(/\.(png|jpg|jpeg|webp|svg)$/i);
    const baseClasses = `absolute inset-0 w-full h-full object-cover ${className}`;

    if (isVideo) {
        return (
            <video src={path} autoPlay loop muted playsInline className={baseClasses} />
        );
    }

    if (isGif) {
        return <img src={path} alt={alt} className={baseClasses} />;
    }

    if (isImage) {
        return <img src={path} alt={alt} className={baseClasses}/>;
    }

    return <p>Неверный формат</p>;
}
