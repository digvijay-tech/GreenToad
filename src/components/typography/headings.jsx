// Headings: h1, h2, h3, h4

export function HeadingOne({ text }) {
    return (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            { text }
        </h1>
    );
}

export function HeadingTwo({ text }) {
    return (
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            { text }
        </h2>
    );
}

export function HeadingThree({ text }) {
    return (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            { text }
        </h3>
    );
}

export function HeadingFour({ text }) {
    return (
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            { text }
        </h4>
    );
}

