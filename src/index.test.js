/* eslint-env jest */

import React from "react";
import { render, Simulate } from "react-testing-library";
import PropTypes from "prop-types";
import useGqlCSS, { GqlCSS, gql } from "./index";
import styles from "../examples/styleguide";
import { h1Styles, h2Styles, customH1Styles, stateStyles } from "../examples/styleQueries";

describe("useGqlCSS", () => {
    it("it allows the extraction of styles with getStyles", () => {
        const { getStyles } = useGqlCSS(styles);
        const extractedStyles = getStyles(h2Styles);
        expect(extractedStyles).toEqual({
            color: "green",
            fontSize: "36px",
            fontWeight: 700,
            marginLeft: 32,
        });
    });
});

describe("GqlCSS", () => {
    it("it renders component without styles", () => {
        const { container } = render(<GqlCSS query={h2Styles}>Using component</GqlCSS>);

        expect(container).toMatchSnapshot();
    });
});
