set -e

echo "Building project"
yarn build
echo "\n\n"

echo "Linting"
yarn lint
echo "\n\n"

echo "Running tests"
yarn test --coverage && codecov
echo "\n\n"