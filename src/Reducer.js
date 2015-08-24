import sortedObject from './sortedObject';
import Constants from './Constants';
import urlUtil from './urlUtil';
import isNull from 'lodash.isnull';
import isUndefined from 'lodash.isundefined';
import shallowEqual from 'react/lib/shallowEqual';


const TYPE_HTML4 = 'html4';
const TYPE_HTML5 = 'html5';

const initialState = {
  pathname: '/',
  query: {},
  defaultParams: {},
  type: TYPE_HTML5
};

// NAVIGATE_TO
const changeParams = (state, params) => {
  const newParams = urlUtil.merge({
    pathname: state.pathname,
    query: state.query
  }, params);
  const newQuery = sortedObject({...state.defaultParams, ...newParams.query});
  const newState = {...state};

  if (newState.pathname !== newParams.pathname) {
    newState.pathname = newParams.pathname;
  }

  if (!shallowEqual(newQuery, newState.query)) {
    newState.query = newQuery;
  }

  return newState;
};


// ADD_DEFAULT_PARAM
const addDefaultParam = (state, {namespace, value}) => {
  const stringValue = `${value}`;
  const newState = {...state};

  if (!newState.defaultParams.hasOwnProperty(namespace) ||
      newState.defaultParams[namespace] !== stringValue) {
    newState.defaultParams[namespace] = stringValue;
    newState.query = sortedObject({...newState.defaultParams, ...newState.query});
  }

  return newState;
};

// REMOVE_PARAM
const removeParam = (state, {namespace}) => {
  const newState = {...state};

  if (newState.defaultParams.hasOwnProperty(namespace)) {
    delete newState.defaultParams[namespace];
  }

  if (newState.query.hasOwnProperty(namespace)) {
    delete newState.query[namespace];
    newState.query = sortedObject(newState.query);
  }

  return newState;
};

// RESTORE_LOCATION
const safeParams = params => {
  const newQuery = isNull(params.query) || isUndefined(params.query) ? {} : params.query;

  Object.keys(newQuery).forEach(key => newQuery[key] = `${newQuery[key]}`);

  return {
    pathname: isNull(params.pathname) || isUndefined(params.pathname) ? '/' : params.pathname,
    query: newQuery
  };
};

const restoreLocation = (state, {location, type = TYPE_HTML5}) => {
  const {pathname: newPathname, query: newQuery} = safeParams(urlUtil.parseHref(url));

  return changeParams(state, {pathname: newPathname, query: {...state.defaultParams, ...newQuery}, type});
};

// MAIN REDUCER
export default (state = initialState, {actionType, payload}) => {
  switch (actionType) {
    case Constants.NAVIGATE_TO:
      return changeParams(state, safeParams(payload));

    case Constants.ADD_DEFAULT_PARAM:
      return addDefaultParam(state, payload);

    case Constants.REMOVE_PARAM:
      return removeParam(state, payload);

    case Constants.RESTORE_LOCATION:
      return restoreLocation(state, payload);

    default:
      return state;
  }
};
