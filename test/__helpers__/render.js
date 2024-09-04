import React from 'react';
import renderer from 'react-test-renderer'; // eslint-disable-line node/no-unpublished-import
import { ThemeProvider } from 'styled-components';
import { IntlProvider } from 'react-intl';
import theme from '../../lib/theme';
import { pick } from 'lodash';

export const renderWithContext = (component) => {
  return renderer.create(
    <IntlProvider locale="en">
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </IntlProvider>,
  );
};

/**
 * A recursive helper to select only the first matching child of a tree
 */
const applyChildSelector = (tree, childSelector) => {
  if (!childSelector) {
    return tree;
  }
  if (tree.children && tree.children.length > 0) {
    const child = tree.children.find(childSelector);
    if (child) {
      return child;
    } else {
      for (const child of tree.children) {
        const found = applyChildSelector(child, childSelector);
        if (found) {
          return found;
        }
      }
    }
  }
};

export const snapshotRender = (component, childSelector = undefined) => {
  const rendered = renderWithContext(component);
  const tree = rendered.toJSON();
  expect(applyChildSelector(tree, childSelector)).toMatchSnapshot();
};

const removeAttributesFromTree = (tree) => {
  if (tree.props) {
    tree.props = pick(tree.props, ['href', 'src']);
  }
  if (tree.children && tree.children.length > 0) {
    tree.children = tree.children.map(removeAttributesFromTree);
  }
  return tree;
};

export const snapshotRenderWithoutAttributes = (component, childSelector = undefined) => {
  const rendered = renderWithContext(component);
  const tree = rendered.toJSON();
  expect(removeAttributesFromTree(applyChildSelector(tree, childSelector))).toMatchSnapshot();
};
