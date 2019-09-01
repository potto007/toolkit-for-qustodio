import { Feature } from 'toolkit/extension/features/feature';
import { isCurrentRouteAccountsPage } from 'toolkit/extension/utils/ynab';

export class ChangeEnterBehavior extends Feature {
  shouldInvoke() {
    return isCurrentRouteAccountsPage() && $('.ynab-grid-body-row.is-adding').length;
  }

  invoke() {
    const $addRow = $('.ynab-grid-body-row.is-adding');
    const $memoInput = $('.ynab-grid-cell-memo input', $addRow);
    const $outflowInput = $('.ynab-grid-cell-outflow input', $addRow);
    const $inflowInput = $('.ynab-grid-cell-inflow input', $addRow);

    if (!$memoInput[0].getAttribute('data-toolkit-save-behavior')) {
      $memoInput[0].setAttribute('data-toolkit-save-behavior', true);
      $memoInput.keydown(this.applyNewEnterBehavior);
    }

    if (!$outflowInput[0].getAttribute('data-toolkit-save-behavior')) {
      $outflowInput[0].setAttribute('data-toolkit-save-behavior', true);
      $outflowInput.keydown(this.applyNewEnterBehavior);
    }

    if (!$inflowInput[0].getAttribute('data-toolkit-save-behavior')) {
      $inflowInput[0].setAttribute('data-toolkit-save-behavior', true);
      $inflowInput.keydown(this.applyNewEnterBehavior);
    }
  }

  applyNewEnterBehavior(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();

      const $saveButton = $(
        '.ynab-grid-actions-buttons .button.button-primary:not(.button-another)'
      );
      $saveButton.click();
    }
  }

  observe(changedNodes) {
    if (!changedNodes.has('ynab-grid-body')) return;

    if (this.shouldInvoke()) {
      this.invoke();
    }
  }
}
