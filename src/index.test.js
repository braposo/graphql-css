/* eslint-env jest */

import React, { useState } from "react";
import { render, cleanup, fireEvent } from "react-testing-library";
import useGqlCSS, { gql, GqlCSS as GqlCSSComponent } from "./index";
import styles from "../examples/styleguide";
import { h2Styles, stateStyles } from "../examples/styleQueries";
import PropTypes from "prop-types";

afterEach(cleanup);

global.console = {
    error: jest.fn(),
};

describe("useGqlCSS", () => {
    describe("with styled", () => {
        it("it returns a styled component", () => {
            const { styled } = useGqlCSS(styles);
            const H2 = styled.h2(h2Styles);
            const { container } = render(<H2>Some heading</H2>);
            expect(container).toMatchSnapshot();
        });

        it("it supports variables and stateful components", () => {
            function StatefulComponent() {
                const [variant, setVariant] = useState("normal");
                const { styled, GqlCSS } = useGqlCSS(styles);
                const toggleVariant = () =>
                    setVariant(state => (state === "normal" ? "done" : "normal"));
                const OtherComponent = styled`{
                    theme(variant: ${props => props.variant}) {
                        button
                    }
                    base {
                        marginLeft: spacing {
                            m
                        }
                    }
                }`;
                OtherComponent.propTypes = {
                    variant: PropTypes.string.isRequired,
                };

                return (
                    <React.Fragment>
                        <GqlCSS
                            query={stateStyles}
                            variables={{ variant }}
                            data-testid="stateful-component"
                            onClick={toggleVariant}
                        >
                            Using stateful component
                        </GqlCSS>
                        <OtherComponent variant={variant}>
                            Other component sharing state
                        </OtherComponent>
                    </React.Fragment>
                );
            }

            const { container, queryByTestId } = render(<StatefulComponent />);

            expect(container).toMatchSnapshot();

            fireEvent.click(queryByTestId("stateful-component"));

            expect(container).toMatchSnapshot();
        });

        it("it fails if props don't exist", () => {
            const { styled } = useGqlCSS(styles);
            const H2 = styled`{
                theme(variant: ${props => props.variant}) {
                    button
                }
                base {
                    marginLeft: spacing {
                        m
                    }
                }
            }`;
            H2.propTypes = {
                variant: PropTypes.string,
            };

            const { container } = render(<H2>Some heading</H2>);
            expect(global.console.error).toHaveBeenCalledWith(
                "Not a valid gql query. Did you forget a prop?"
            );
            expect(container).toMatchSnapshot();
        });

        it("it fails if interpolation is null", () => {
            const { styled } = useGqlCSS(styles);
            const H2 = styled`{
                theme(variant: ${null}) {
                    button
                }
                base {
                    marginLeft: spacing {
                        m
                    }
                }
            }`;

            const { container } = render(<H2>Some heading</H2>);
            expect(global.console.error).toHaveBeenCalledWith(
                "Not a valid gql query. Did you forget a prop?"
            );
            expect(container).toMatchSnapshot();
        });

        it("it handles style interpolation", () => {
            const { styled } = useGqlCSS(styles);
            const color = "blue";
            const H3 = styled.h3`{
                base {
                    marginLeft: spacing {
                        m
                    }
                }
        
                ${props =>
                    props.primary &&
                    `
                      base {
                          color: colors {
                              ${color}
                          }
                      }
                `}
            }`;
            H3.propTypes = {
                primary: PropTypes.bool.isRequired,
            };
            H3.defaultProps = {
                primary: false,
            };

            const { container } = render(<H3>Some heading</H3>);
            expect(container).toMatchSnapshot();
        });
    });

    describe("with getStyles", () => {
        it("it allows the extraction of styles", () => {
            const { getStyles } = useGqlCSS(styles);
            const query = gql`
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
            const extractedStyles = getStyles(query);
            expect(extractedStyles).toEqual({
                color: "green",
                fontSize: "36px",
                fontWeight: 700,
                marginLeft: "32px",
            });
        });

        it("it supports variables", () => {
            const { getStyles } = useGqlCSS(styles);
            const query = gql`
                {
                    theme(variant: $variant) {
                        button
                    }
                }
            `;
            const extractedStyles = getStyles(query, { variant: "done" });
            expect(extractedStyles).toEqual({
                backgroundColor: "green",
                cursor: "pointer",
                fontSize: 36,
                padding: 24,
            });
        });

        it("it handles fragments", () => {
            const { getStyles } = useGqlCSS(styles);
            const headingStyles = gql`
                fragment Heading on Styles {
                    base {
                        typography {
                            fontSize: scale {
                                xl
                            }
                            fontWeight: weight {
                                bold
                            }
                        }
                    }
                }
            `;
            const query = gql`
                ${headingStyles}
                {
                    ...Heading
                    base {
                        color: colors {
                            blue
                        }
                    }
                }
            `;
            const extractedStyles = getStyles(query);
            expect(extractedStyles).toEqual({
                color: "blue",
                fontSize: "52px",
                fontWeight: 700,
            });
        });

        it("it handles custom units", () => {
            const { getStyles } = useGqlCSS(styles);
            const query = gql`
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
                        marginLeft: spacing(unit: "em") {
                            s
                        }
                        color: colors {
                            green
                        }
                    }
                }
            `;
            const extractedStyles = getStyles(query);
            expect(extractedStyles).toEqual({
                color: "green",
                fontSize: "36px",
                fontWeight: 700,
                marginLeft: "4em",
            });
        });

        it("it only supports gql queries", () => {
            const { getStyles } = useGqlCSS(styles);
            const query = "something else";
            expect(() => getStyles(query)).toThrowError("Query must be a valid gql query");
        });
    });
});

describe("GqlCSS", () => {
    it("it renders component without styles", () => {
        const { container } = render(
            <GqlCSSComponent query={h2Styles}>Using component without styles</GqlCSSComponent>
        );

        expect(container).toMatchSnapshot();
    });

    it("it renders component with styles", () => {
        const { container } = render(
            <GqlCSSComponent styles={styles} query={h2Styles}>
                Using component with styles
            </GqlCSSComponent>
        );

        expect(container).toMatchSnapshot();
    });
});
