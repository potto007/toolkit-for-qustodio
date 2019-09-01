import { getRouter, controllerLookup } from './ember';

export function transitionTo() {
  getRouter().transitionTo(...arguments);
}

export function getEntityManager() {
  return qustodio.QustodioSharedLib.defaultInstance.entityManager;
}

export function getCurrentBudgetDate() {
  const date = controllerLookup('application').get('monthString');
  return { year: date.slice(0, 4), month: date.slice(4, 6) };
}

export function isCurrentRouteTimeLimitsPage() {
  const currentRoute = getCurrentRouteName();

  return (
    currentRoute === qustodio.constants.RouteNames.TimeLimitsSelect ||
    currentRoute === qustodio.constants.RouteNames.TimeLimitsIndex
  );
}

export function isCurrentRouteAppsPage() {
  const currentRoute = getCurrentRouteName();

  return (
    currentRoute === qustodio.constants.RouteNames.AppsSelect ||
    currentRoute === qustodio.constants.RouteNames.AppsIndex
  );
}

export function isCurrentRouteWebPage() {
  const currentRoute = getCurrentRouteName();

  return (
    currentRoute === qustodio.constants.RouteNames.WebSelect ||
    currentRoute === qustodio.constants.RouteNames.WebIndex
  );
}

export function getCurrentRouteName() {
  return controllerLookup('application').get('activeRoute');
}

export function getCategoriesViewModel() {
  return controllerLookup('application').get('categoriesViewModel');
}

export function getAllBudgetMonthsViewModel() {
  return controllerLookup('application').get('allBudgetMonthsViewModel');
}

export function getBudgetViewModel() {
  return controllerLookup('application').get('budgetViewModel');
}

export function getSelectedMonth() {
  const monthString = controllerLookup('application').get('monthString');
  return qustodio.utilities.DateWithoutTime.createFromString(monthString, 'YYYYMM');
}

export function getSidebarViewModel() {
  return controllerLookup('application').get('sidebarViewModel');
}

export function isCurrentMonthSelected() {
  const today = new qustodio.utilities.DateWithoutTime();
  const selectedMonth = getSelectedMonth();

  if (selectedMonth) {
    return today.equalsByMonth(selectedMonth);
  }

  return false;
}

export function isQustodioReady() {
  return (
    typeof Ember !== 'undefined' &&
    typeof $ !== 'undefined' &&
    !$('.ember-view.is-loading').length &&
    typeof qustodioToolKit !== 'undefined' &&
    typeof QUSTODIOFEATURES !== 'undefined'
  );
}
