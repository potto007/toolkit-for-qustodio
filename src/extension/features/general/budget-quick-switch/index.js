import * as React from 'react';
import { componentPrepend } from 'toolkit/extension/utils/react';
import { Feature } from 'toolkit/extension/features/feature';
import { BudgetListItem } from './components/budget-list-item';
import { controllerLookup } from 'toolkit/extension/utils/ember';

export class BudgetQuickSwitch extends Feature {
  populateBudgetList() {
    const modalList = $('.modal-list')[0];
    let activeBudgetVersionId = controllerLookup('application').get('budgetVersionId');

    ynab.YNABSharedLib.getCatalogViewModel_UserViewModel().then(({ userBudgetDisplayItems }) => {
      userBudgetDisplayItems
        .filter(budget => {
          return (
            !budget.get('isTombstone') && budget.get('budgetVersionId') !== activeBudgetVersionId
          );
        })
        .forEach((budget, i) => {
          const budgetVersionName = budget.get('budgetVersionName');
          const budgetVersionId = budget.get('budgetVersionId');

          if (i === 0) {
            componentPrepend(
              <li>
                <hr />
              </li>,
              modalList
            );
          }

          componentPrepend(
            <BudgetListItem
              key={budget.get('budgetVersionId')}
              budgetVersionId={budgetVersionId}
              budgetVersionName={budgetVersionName}
            />,
            modalList
          );
        });
    });
  }

  observe(changedNodes) {
    if (changedNodes.has('ynab-u modal-popup modal-sidebar-menu ember-view modal-overlay active')) {
      this.populateBudgetList();
    }
  }
}
