const Box = ({ className, imgAlt, imgSrc, children }) => {
    const boxClass = `
    ${className}
    items-start
    flex flex-row
    rounded-lg
    shadow-xl
    my-2
    p-4`;

    const imgClasses = `
    w-20 h-20
    rounded-full`;

    return(
        <div className={boxClass}>
            {imgSrc && (
                <img
                    className={imgClasses}
                    src={imgSrc}
                    alt={imgAlt}
                />
            )}
            {children}
        </div>
    )
}

export default Box;