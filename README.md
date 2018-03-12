## graphql-css

A very serious GraphQL + CSS integration.

## Installation

```bash
npm install graphql-css
# or
yarn add graphql-css
```

## Quick start

```jsx
import gqlCSS from "graphql-css";
import styles from "your-style-guide";

const textStyles = gql`
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

const Text = graphqlCSS(styles)(textStyles);

const App = () => (
    <Text>This is a styled text</Text>
);
```

## API

`graphql-css` exports one helper function `gqlCSS()` and two components `<GqlCSS>` and `<GqlCSSProvider>`.

#### gqlCSS
`gqlCSS` needs to be initialised with the styles from the styleguide in a JSON format (check examples folder for a detailed example).

It works with the following format `gqlCSS(styles)(query, element)`:

| Arg           | Type            | Default                           | Definition                                                                                                                                    |
| -------------- | --------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| styles       | object          |       | The styleguide object with all the rules |
| query       | gql          |       | The gql query to get the styles |
| tag       | string \|\| boolean         | "div"      | HTML tag to be displayed. If set to false only styles are returned. |

Here's how you can use it:

```jsx
const Text = gqlCSS(styles)(query);
...
<Text>This is a styled text<Text>
```
alternatively you can also initialise it separately and reuse it:
```jsx
const getStyles = gqlCSS(styles);
...
const ComponentOne = getStyles(queryOne);
const ComponentTwo = getStyles(queryTwo);
```

`gqlCSS` returns a `glamorous` component by default, which means it accepts everything that `glamorous` supports such as additional styling through the `css` prop or changing the HTML tag used.

```jsx
const Component = gqlCSS(styles)(query);
const ComponentH1 = gqlCSS(styles)(query, "h1");
...
<Component css={{ marginTop: 10 }} />
<ComponentH1 />
```

If the `tag` argument is set to false it'll only return the styles object so it can be used with other libraries or just inline styles.

```jsx
const styles = gqlCSS(styles)(query, false);
...
<div styles={styles}>Inline styled text</div>
```

#### GqlCSS

`<GqlCSS>` component allows for a more declarative API and accepts these props:

| Prop           | Type            | Default                           | Definition                                                                                                                                    |
| -------------- | --------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| styles       | object          |       | The styleguide object with all the rules |
| query       | gql          |       | The gql query to get the styles |
| tag       | string          | "div"      | HTML tag to be displayed |

All the remaining props are passed to the generated component so you can still use `glamorous` API. Here are some examples:

```jsx
...
<GqlCSS styles={styles} query={query}>This is a styled text</GqlCSS>
<GqlCSS styles={styles} query={queryH1} tag="h1">This is a styled H1 heading</GqlCSS>
<GqlCSS styles={styles} query={queryH1} css={{ marginBottom: 10 }}>This is a custom styled text</GqlCSS>
...
```

#### GqlCSSProvider
The `<GqlCSSProvider>` component allows to pass down the styles definition to any `<GqlCSS>` component that exists down the tree. Ideally, you'd use `<GqlCSSProvider>` in the root of your application.

```jsx
<GqlCSSProvider styles={styles}>
    <App />
</GqlCSSProvider>

// Somewhere inside your App
<GqlCSS query={h1Styles} css={{ marginTop: 30 }}>
    Using provider
</GqlCSS>
<div>
    <div>
        <span>
            <GqlCSS query={h2Styles}>Deep nested child using provider</GqlCSS>
        </span>
    </div>
</div>
```

## Developing
You can use `yarn run dev` and `yarn run dev:server` to run the examples and test this library before using it in your project.

## License

[MIT](https://github.com/davidgomes/graphql-css/blob/master/LICENSE)
