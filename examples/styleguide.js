const base = 4;
const baseStyles = {
    typography: {
        scale: {
            s: base * 3,
            base: base * 4,
            m: base * 6,
            l: base * 9,
            xl: base * 13,
            xxl: base * 20,
            unit: "px",
        },
        weight: {
            thin: 300,
            normal: 400,
            bold: 700,
            bolder: 900,
        },
    },
    spacing: {
        s: base,
        base: base * 2,
        m: base * 4,
        l: base * 6,
        xl: base * 8,
        xxl: base * 10,
        unit: "px",
    },
    colors: {
        blue: "blue",
        green: "green",
        red: "red",
    },
};

const styles = {
    base: baseStyles,
    theme: {
        normal: {
            button: {
                fontSize: baseStyles.typography.scale.l,
                backgroundColor: baseStyles.colors.red,
                padding: baseStyles.spacing.l,
                cursor: "pointer",
            },
        },
        done: {
            button: {
                fontSize: baseStyles.typography.scale.l,
                backgroundColor: baseStyles.colors.green,
                padding: baseStyles.spacing.l,
                cursor: "pointer",
            },
        },
    },
};

export default styles;
