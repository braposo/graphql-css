const primitives = {
    colors: {
        blue: "blue",
        green: "green",
        red: "red",
    },

    spacing: {
        s: "4px",
        base: "8px",
        m: "16px",
        l: "24px",
        xl: "32px",
        xxl: "40px",
    },
};

const styles = {
    typography: {
        h1: {
            fontSize: "30px",
            fontWeight: 700,
            color: primitives.colors.blue,
        },
        h2: {
            fontSize: "24px",
            fontWeight: 700,
            color: primitives.colors.red,
        },
    },
    spacing: primitives.spacing,
    colors: primitives.colors,
};

export default styles;
