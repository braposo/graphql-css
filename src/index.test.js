/* eslint-env jest */

import React from "react";
import { render, cleanup } from "react-testing-library";
import useGqlCSS, { GqlCSS } from "./index";
import styles from "../examples/styleguide";
import { h2Styles } from "../examples/styleQueries";

afterEach(cleanup);

describe("useGqlCSS", () => {
    it("it allows the extraction of styles with getStyles", () => {
        const { getStyles } = useGqlCSS(styles);
        const extractedStyles = getStyles(h2Styles);
        expect(extractedStyles).toEqual({
            color: "green",
            fontSize: "36px",
            fontWeight: 700,
            marginLeft: "32px",
        });
    });
});

describe("GqlCSS", () => {
    it("it renders component without styles", () => {
        const { container } = render(
            <GqlCSS query={h2Styles}>Using component without styles</GqlCSS>
        );

        expect(container).toMatchSnapshot();
    });

    it("it renders component with styles", () => {
        const { container } = render(
            <GqlCSS styles={styles} query={h2Styles}>
                Using component with styles
            </GqlCSS>
        );

        expect(container).toMatchSnapshot();
    });
});
