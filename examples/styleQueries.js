import gql from "graphql-tag";

export const h2Styles = gql`
    {
        base {
            typography {
                fontSize: scale {
                    l
                }
                fontWeight: weight {
                    bold
                }
            }
            marginLeft: spacing {
                xl
            }
            color: colors {
                green
            }
        }
    }
`;

export const h1Styles = gql`
    fragment H1 on styles {
        base {
            typography {
                fontSize: scale {
                    xl
                }
                fontWeight: weight {
                    bold
                }
            }
            marginLeft: spacing {
                l
            }
            color: colors {
                red
            }
        }
    }
`;

export const customH1Styles = gql`
    ${h1Styles}
    {
        ...H1
        base {
            marginLeft: spacing(unit: "em") {
                s
            }
            color: colors {
                blue
            }
        }
    }
`;

export const stateStyles = gql`
    {
        theme(variant: $variant) {
            button
        }
    }
`;
