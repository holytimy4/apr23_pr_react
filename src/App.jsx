/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(
    categ => categ.id === product.categoryId,
  );

  const user = usersFromServer.find(us => us.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedCategoriesId, setSelectedCategoriesId] = useState([]);
  const [isReversed, setIsReversed] = useState(false);
  const [sortBy, setSortBy] = useState('');

  let visibleProducts = [...products];

  if (selectedUserId) {
    visibleProducts = visibleProducts.filter(
      product => product.user.id === selectedUserId,
    );
  }

  if (query) {
    visibleProducts = visibleProducts.filter(
      product => product.name.toLowerCase()
        .includes(query.toLowerCase().trim()),
    );
  }

  if (selectedCategoriesId.length) {
    visibleProducts = visibleProducts.filter(
      product => selectedCategoriesId.includes(product.categoryId),
    );
  }

  if (sortBy) {
    visibleProducts.sort((prodF, prodS) => {
      switch (sortBy) {
        case 'id':
          return prodS.id - prodF.id;
        case 'product':
          return prodS.name.localeCompare(prodF.name);
        case 'category':
          return prodS.category.title.localeCompare(prodF.category.title);
        case 'user':
          return prodS.user.name.localeCompare(prodF.user.name);
        default:
          return null;
      }
    });
  }

  if (isReversed) {
    visibleProducts.reverse();
  }

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  const handleToggleCategory = (categoryId) => {
    if (selectedCategoriesId.includes(categoryId)) {
      setSelectedCategoriesId(
        selectedCategoriesId.filter(id => categoryId !== id),
      );
    } else {
      setSelectedCategoriesId(categoriesId => [...categoriesId, categoryId]);
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleReset = () => {
    setSelectedUserId(0);
    setQuery('');
    setSelectedCategoriesId([]);
    setIsReversed(false);
    setSortBy('');
  };

  const handleSort = (category) => {
    if (sortBy !== category) {
      setSortBy(category);

      return;
    }

    if (!isReversed) {
      setIsReversed(true);

      return;
    }

    setSortBy('');
    setIsReversed(false);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                className={cn({
                  'is-active': selectedUserId === 0,
                })}
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => handleUserSelect(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  className={cn({
                    'is-active': selectedUserId === user.id,
                  })}
                  data-cy="FilterAllUsers"
                  href="#/"
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={handleInputChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query.length > 0 && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button', 'is-success', 'mr-6', {
                  'is-outlined': selectedCategoriesId.length > 0,
                })}
                onClick={() => setSelectedCategoriesId([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={cn('button', 'mr-2', 'my-1', {
                    'is-info': selectedCategoriesId.includes(category.id),
                  })}
                  href="#/"
                  key={category.id}
                  onClick={() => handleToggleCategory(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleReset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length > 0 ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/" onClick={() => handleSort('id')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn('fas', {
                              'fa-sort': sortBy !== 'id',
                              'fa-sort-up': sortBy === 'id' && isReversed,
                              'fa-sort-down': sortBy === 'id' && !isReversed,
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/" onClick={() => handleSort('product')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn('fas', {
                              'fa-sort': sortBy !== 'product',
                              'fa-sort-up': sortBy === 'product' && isReversed,
                              'fa-sort-down': (
                                sortBy === 'product' && !isReversed
                              ),
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/" onClick={() => handleSort('category')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn('fas', {
                              'fa-sort': sortBy !== 'category',
                              'fa-sort-up': sortBy === 'category' && isReversed,
                              'fa-sort-down': (
                                sortBy === 'category' && !isReversed
                              ),
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/" onClick={() => handleSort('user')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn('fas', {
                              'fa-sort': sortBy !== 'user',
                              'fa-sort-up': sortBy === 'user' && isReversed,
                              'fa-sort-down': sortBy === 'user' && !isReversed,
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {`${product.category.icon} - ${product.category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={cn('has-text-link', {
                        'has-text-danger': product.user.sex === 'f',
                        'has-text-link': product.user.sex === 'm',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
