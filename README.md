# <a href="https://github.com/braposo/graphql-css"><img src="https://user-images.githubusercontent.com/38172/37561184-50288d50-2a40-11e8-9f19-e23c4ca61c32.png" width="376" /></a>

`graphql-css` is a blazing fast CSS-in-GQL™ library that converts GraphQL queries into styles for your components.

Comes with a bunch of utilities so it's easy to integrate with your favourite way of building components.

[![Build Status][build-badge]][travis]
[![Code Coverage][coverage-badge]][coverage]
[![npm version][version-badge]][npm]
[![npm downloads][downloads-badge]][npm]
[![gzip size][size-badge]][size]
[![MIT License][license-badge]][license]

![Module format][modules-badge]
![Prettier format][prettier-badge]
[![PRs Welcome][prs-badge]][prs]
![Blazing Fast][fast-badge]
![Modern][modern-badge]
![Enterprise Grade][enterprise-badge]

## Installation

```bash
npm install graphql-css
# or
yarn add graphql-css
```

#### Dependencies

`graphql-css` requires `graphql` to be installed as a peer dependency. It's compatible with [React hooks](https://reactjs.org/docs/hooks-intro.html) so you can use it with React's latest version.

## Quick start

```jsx
import useGqlCSS from "graphql-css";
import styles from "your-style-guide";

const App = () => {
    const { styled } = useGqlCSS(styles);
    const H2 = styled.h2`
        {
            typography {
                h2
            }
            marginLeft: spacing {
                xl
            }
            color: colors {
                green
            }
        }
    `;
    return <H2>This is a styled text</H2>;
};
```

[![Edit graphql-css][codesandbox-badge]][codesandbox]

## API

By default, `graphql-css` exports a hook-like function called `useGqlCSS`. 

It also exports a couple of other utilities:

-   `GqlCSS`: a component that provides the same declarative API
-   `gql`: the default export from `graphql-tag` so you don't have to install it if only using graphql-css

### useGqlCSS

The main export is the `useGqlCSS` function that should be used in most cases. It provides these utilities:

-   `styled`: a styled-component inspired function to create components from gqlCSS queries
-   `getStyles`: a function to extract styles to an object
-   `GqlCSS`: a component that encapsulates the `styled` functionality

`useGqlCSS` needs to be initialised with the styles from the styleguide in a JSON format (check examples folder for a detailed example).

Here's how you can use it to create a new component with `styled`:

```jsx
import useGqlCSS from "graphql-css";
...
const { styled } = useGqlCSS(styles);
const Text = styled.p`
    {
        typography {
            fontSize: scale {
                l
            }
        }
    }
`;
...
<Text>This is a styled text</Text>
```

alternatively, you can also return the styles as an object with `getStyles` so you can use it with other CSS-in-JS libraries:

```jsx
import useGqlCSS, { gql } from "graphql-css";
import styled from "@emotion/styled";
...
const query = gql`
    {
        color: colors {
            green
        }
    }
`;
const { getStyles } = useGqlCSS(styles);
const StyledComponent = styled.div(getStyles(query));
```

If you want to keep the declarative API you can also use the `GqlCSS`, which is an exact match to the main `GqlCSS` component exported by this library. The only difference is that the `useGqlCSS` version already has the styles initialised.

```jsx
import useGqlCSS, { gql } from "graphql-css";
...
const { GqlCSS } = useGqlCSS(styles);
const query = gql`
    {
        typography {
            h2
        }
    }
`;
...
<GqlCSS query={query} component="h2">This is a styled text</GqlCSS>
```

Please check the `GqlCSS` section below for a detailed reference.

### GqlCSS

`<GqlCSS>` component allows for a more declarative API and accepts these props:

| Prop      | Type             | Default | Definition                                      |
| --------- | ---------------- | ------- | ----------------------------------------------- |
| styles    | object           |         | The styleguide object with all the rules        |
| query     | gql              |         | The gql query to get the styles                 |
| component | string \|\| node | "div"   | HTML element or React component to be displayed |

All the remaining props are passed to the generated component. Here are some examples:

```jsx
...
<GqlCSS styles={styles} query={query}>This is a styled text</GqlCSS>
<GqlCSS styles={styles} query={queryH1} component="h1">This is a styled H1 heading</GqlCSS>
...
```

## Styles object

The styles object is a valid JSON object that is used to define the styleguide of your project. Usually it includes definitions for colors, spacing, typography, etc.

```js
const base = 4;
const styles = {
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
```

This is completely up to you and one of the big advantages of using `graphql-css` as you can adapt it to your needs. As long as the styles and the queries match their structure, there shouldn't be much problem.

You can also specify the unit of each property by definining the `unit` key.

```js
scale: {
    s: base * 3,
    base: base * 4,
    m: base * 6,
    l: base * 9,
    xl: base * 13,
    xxl: base * 20,
    unit: "em"
},
```

## Building the GraphQL query

The GraphQL query follows the structure of the styles object with a few particular details. When building the query you need to alias the values you're getting from the style guide to the correspondent CSS property. Here's a quick example:

```js
{
    typography {
        fontSize: scale {
            xl
        }
        fontWeight: weight {
            bold
        }
    }
}
```

This also means that you can reuse the same query by using different alias:

```js
{
    marginLeft: spacing {
        l
    }
    paddingTop: spacing {
        xl
    }
}
```

#### Using fragments

Because _This is just GraphQL™_, you can also create fragments that can then be included in other queries:

```js
const h1Styles = gql`
    fragment H1 on Styles {
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

const otherH1Styles = gql`
    ${h1Styles}
    {
        ...H1
        base {
            color: colors {
                blue
            }
        }
    }
`;
```

This is a powerful pattern that avoids lots of repetitions and allows for a bigger separation of concerns.

#### Defining custom unit

You can also override the pre-defined unit directly in your query by using the argument `unit`:

```js
{
    marginLeft: spacing(unit: "em") {
        l
    }
    paddingTop: spacing {
        xl
    }
}
```

This will return `{ marginLeft: "24em", paddingTop: "32px" }`.

#### Using style variations (theming)

One of the big advantages of CSS-in-GQL™ is that you can use the power of variables to build custom queries. In `graphql-css` that means that we can easily define variants (think themes) for specific components.

Let's start with this style definition file:

```js
const styles = {
    theme: {
        light: {
            button: {
                // button light styles
            },
        },
        dark: {
            button: {
                // button dark styles
            },
        },
    },
};
```

We now have two options to handle theming, first using the `styled` function from `useGqlCSS`:

```jsx
import useGqlCSS, { gql } from "graphql-css";
...
const { styled } = useGqlCSS(styles);
const Button = styled.button`
    {
        theme(variant: ${props => props.variant}) {
            button
        }
    }
`;
...
<Button variant="dark">Some text</Button>
```

Alternatively, we can use GraphQL variables instead by using `getStyles`:

```jsx
import useGqlCSS, { gql } from "graphql-css";
import styled from "@emotion/styled";
...
const { getStyles } = useGqlCSS(styles);
const query = gql`
    {
        theme(variant: $variant) {
            button
        }
    }
`;
const LightButton = styled.button(getStyles(query, { variant: "light" }));
...
<LightButton>Some text</LightButton>
```

## Developing

You can use `yarn run dev` to run it locally, but we recommend using the [CodeSandbox playground][codesandbox] for development.

## Contributing

Please follow our [contributing guidelines](https://github.com/braposo/graphql-css/blob/master/CONTRIBUTING.md).

## License

[MIT](https://github.com/davidgomes/graphql-css/blob/master/LICENSE)

[npm]: https://www.npmjs.com/package/graphql-css
[license]: https://github.com/braposo/graphql-css/blob/master/LICENSE
[prs]: http://makeapullrequest.com
[size]: https://unpkg.com/graphql-css/dist/graphql-css.min.js
[version-badge]: https://img.shields.io/npm/v/graphql-css.svg?style=flat-square
[downloads-badge]: https://img.shields.io/npm/dm/graphql-css.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/graphql-css.svg?style=flat-square
[fast-badge]: https://img.shields.io/badge/🔥-Blazing%20Fast-red.svg?style=flat-square
[modern-badge]: https://img.shields.io/badge/💎-Modern-44aadd.svg?style=flat-square
[enterprise-badge]: https://img.shields.io/badge/🏢-Enterprise%20Grade-999999.svg?style=flat-square
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/graphql-css/dist/graphql-css.min.js?compression=gzip&style=flat-square
[prettier-badge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[build-badge]: https://img.shields.io/travis/braposo/graphql-css.svg?style=flat-square
[travis]: https://travis-ci.org/braposo/graphql-css
[coverage-badge]: https://img.shields.io/codecov/c/github/braposo/graphql-css.svg?style=flat-square
[coverage]: https://codecov.io/github/braposo/graphql-css
[modules-badge]: https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20esm-green.svg?style=flat-square
[codesandbox-badge]: https://codesandbox.io/static/img/play-codesandbox.svg
[codesandbox]: https://codesandbox.io/s/github/braposo/graphql-css/
