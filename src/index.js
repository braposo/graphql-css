import React from "react";
import graphql from "graphql-anywhere";
import cxs from "cxs/component";
import { default as internalGql } from "graphql-tag";
import { isGqlQuery, smoosh, interleave, buildQuery, isPlainObject, domElements } from "./utils";

const resolver = (fieldName, root, args, context, { resultKey }) => {
    // if it's an aliased query add alias as prop
    if (fieldName !== resultKey) {
        return {
            ...root[fieldName],
            ...args,
            prop: resultKey,
        };
    }

    let res = root[fieldName];
    const rootUnit = root && root.unit;
    const argsUnit = args && args.unit;
    const argsVariant = args && args.variant;

    if (argsUnit || rootUnit) {
        const unit = argsUnit || rootUnit;
        res = root[fieldName] + unit;
    }

    if (argsVariant) {
        res = root[fieldName][argsVariant];
    }

    // if has prop then use it as the key
    if (root.prop) {
        return {
            [root.prop]: res,
        };
    }

    return res;
};

const gqlcssFactory = (el, styles) => (query, ...interpolations) => {
    // It's an object from getStyles()
    if (isPlainObject(query) && !isGqlQuery(query)) {
        return cxs(el)(query);
    }

    // map domelements to factory so we can do gqlcss.h2`query`
    return cxs(el)(props => {
        const parsedQuery = isGqlQuery(query)
            ? query
            : internalGql(buildQuery(interleave(query, interpolations), props).join(""));
        let generatedStyles = {};

        try {
            generatedStyles = smoosh(graphql(resolver, parsedQuery, styles));
        } catch (e) {
            console.error("Not a valid gql query: ", e);
        }
        return generatedStyles;
    });
};

// Component for more declarative API
export const GqlCSS = ({ component = "div", query, styles, variables, ...rest }) => {
    const { gqlcss, getStyles } = useGqlCSS(styles);
    const Component = gqlcss[component](getStyles(query, variables));

    return <Component {...rest} />;
};

// Hook that returns gqlcss template tag, getStyles function and GqlCSS component
const useGqlCSS = styles => {
    const getStyles = (query, variables) => {
        if (!isGqlQuery(query)) {
            throw new Error("Query must be a gql query");
        }

        const generatedStyles = smoosh(graphql(resolver, query, styles, null, variables));

        return generatedStyles;
    };

    const gqlcss = gqlcssFactory("div", styles);
    domElements.forEach(domElement => {
        gqlcss[domElement] = gqlcssFactory(domElement, styles);
    });

    const GqlCSSComponent = props => GqlCSS({ styles, ...props });

    return { gqlcss, getStyles, GqlCSS: GqlCSSComponent };
};

// Export gql since it's already a dependency anyway
export const gql = internalGql;

// Export hook by default
export default useGqlCSS;
