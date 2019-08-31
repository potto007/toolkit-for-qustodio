import { l10n } from 'toolkit/extension/utils/toolkit';
import { getEntityManager } from 'toolkit/extension/utils/ynab';
import { Feature } from 'toolkit/extension/features/feature';
import { isCurrentRouteBudgetPage } from 'toolkit/extension/utils/ynab';
import { formatCurrency } from 'toolkit/extension/utils/currency';
import { Collections } from 'toolkit/extension/utils/collections';

export class DaysOfBuffering extends Feature {
  _lookbackMonths = parseInt(ynabToolKit.options.DaysOfBufferingHistoryLookup);
  _lookbackDays = this._lookbackMonths * 30;

  injectCSS() {
    return require('./index.css');
  }

  shouldInvoke() {
    return isCurrentRouteBudgetPage() && !document.querySelector('toolkit-days-of-buffering');
  }

  invoke() {
    const eligibleTransactions = getEntityManager()
      .getAllTransactions()
      .filter(this._eligibleTransactionFilter);
    const onBudgetAccounts = Collections.accountsCollection.getOnBudgetAccounts();

    let onBudgetBalance = 0;
    if (onBudgetAccounts) {
      onBudgetBalance = onBudgetAccounts.reduce((reduced, current) => {
        const calculation = current.getAccountCalculation();
        if (calculation && !calculation.getAccountIsTombstone()) {
          reduced += calculation.getBalance();
        }

        return reduced;
      }, 0);
    }

    const calculation = this._calculateDaysOfBuffering(onBudgetBalance, eligibleTransactions);
    this._updateDisplay(calculation);
  }

  onRouteChanged() {
    if (this.shouldInvoke()) {
      this.invoke();
    }
  }

  _updateDisplay(calculation) {
    const { averageDailyOutflow, daysOfBuffering, totalDays, totalOutflow } = calculation;
    const daysOfBufferingContainer = document.querySelector('.toolkit-days-of-buffering');
    let $displayElement = $(daysOfBufferingContainer);
    if (!daysOfBufferingContainer) {
      $displayElement = $('<div>', {
        class: 'budget-header-item budget-header-days toolkit-days-of-buffering',
      })
        .append(
          $('<div>', {
            class: 'budget-header-days-age',
            title: l10n('budget.dob.tooltip', "Don't like AoM? Try this out instead!"),
          })
        )
        .append(
          $('<div>', {
            class: 'budget-header-days-label',
            text: l10n('budget.dob.title', 'Days of Buffering'),
            title: l10n('budget.dob.tooltip', "Don't like AoM? Try this out instead!"),
          })
        );

      $('.budget-header-flexbox').append($displayElement);
    }

    if (calculation.notEnoughDates) {
      $('.budget-header-days-age', $displayElement).text('???');
      $('.budget-header-days-age', $displayElement).attr(
        'title',
        l10n(
          'budget.dob.noHistory',
          'Your budget history is less than 15 days. Go on with YNAB a while.'
        )
      );
    } else {
      const dayText =
        daysOfBuffering === 1.0
          ? l10n('budget.ageOfMoneyDays.one', 'day')
          : l10n('budget.ageOfMoneyDays.other', 'days');
      $('.budget-header-days-age', $displayElement).text(`${daysOfBuffering} ${dayText}`);
      $('.budget-header-days-age', $displayElement).attr(
        'title',
        `${l10n('budget.dob.outflow', 'Total outflow')}: ${formatCurrency(totalOutflow)}
${l10n('budget.dob.days', 'Total days of budgeting')}: ${totalDays}
${l10n('budget.dob.avgOutflow', 'Average daily outflow')}: ~${formatCurrency(averageDailyOutflow)}`
      );
    }
  }

  /**
   * Days of buffering is calculated by taking the total outflows within the selected window and
   * dividing it by the number of days in the selected window. The selected window comes from
   * the DaysOfBufferingHistoryLookup option and is represented in months. We estimate days to
   * be (number of months * 30). If the user selected "all history", the divisor is simply the
   * number of days since the first eligible transaction. If there are not at least 15 unique
   * days within the window that have an eligible transaction, we consider the metric unable to
   * be calculated.
   */
  _calculateDaysOfBuffering = (balance, transactions) => {
    const { dates, totalOutflow, uniqueDates } = transactions.reduce(
      (reduced, current) => {
        const { amount, date } = current.getProperties('amount', 'date');
        reduced.dates.push(date.toUTCMoment());
        reduced.uniqueDates.set(date.format());
        reduced.totalOutflow += amount;
        return reduced;
      },
      { dates: [], totalOutflow: 0, uniqueDates: new Map() }
    );

    const minDate = moment.min(dates);
    const maxDate = moment.max(dates);
    const availableDates = maxDate.diff(minDate, 'days');

    let averageDailyOutflow;
    if (this._lookbackDays !== 0) {
      averageDailyOutflow = Math.abs(totalOutflow / this._lookbackDays);
    } else {
      averageDailyOutflow = Math.abs(totalOutflow / availableDates);
    }

    let daysOfBuffering = balance / averageDailyOutflow;
    if (daysOfBuffering < 10) {
      daysOfBuffering = daysOfBuffering.toFixed(1);
    } else {
      daysOfBuffering = Math.floor(daysOfBuffering);
    }

    const notEnoughDates = uniqueDates.size < 15;
    if (notEnoughDates) {
      daysOfBuffering = null;
    }

    return {
      averageDailyOutflow,
      daysOfBuffering,
      notEnoughDates,
      totalDays: uniqueDates.size,
      totalOutflow,
    };
  };

  _eligibleTransactionFilter = transaction => {
    const today = new ynab.utilities.DateWithoutTime();

    let isEligibleDate = false;
    if (this._lookbackDays === 0) {
      isEligibleDate = true;
    } else {
      isEligibleDate = transaction.get('date').daysApart(today) < this._lookbackDays;
    }

    return (
      isEligibleDate &&
      !transaction.get('isTombstone') &&
      !transaction.get('payee.isInternal') &&
      !transaction.isTransferTransaction() &&
      transaction.get('account.onBudget') &&
      transaction.get('amount') < 0
    );
  };
}
