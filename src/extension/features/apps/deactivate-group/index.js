import { Feature } from 'toolkit/extension/features/feature';
import { getToolkitStorageKey } from 'toolkit/extension/utils/toolkit';
import { isCurrentRouteAppsPage, getEntityManager } from 'toolkit/extension/utils/qustodio';
import { controllerLookup } from 'toolkit/extension/utils/ember';

const GROUP_COLORS = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'];

export class DeactivateGroup extends Feature {
  get _checkedRows() {
    return controllerLookup('accounts').get('areChecked');
  }

  get _isAnyCheckedTransactionFlagged() {
    return this._checkedRows.some(transaction => transaction.get('group'));
  }

  injectCSS() {
    return require('./index.css');
  }

  shouldInvoke() {
    return isCurrentRouteAppsPage();
  }

  invoke() {
    const $editModal = $('.modal-account-edit-transaction-list');
    if (!$editModal.length) {
      return;
    }

    this._injectButtons($editModal);
  }

  observe(changedNodes) {
    if (
      changedNodes.has(
        'qustodio-u modal-popup modal-account-edit-transaction-list ember-view modal-overlay active'
      )
    ) {
      this.invoke();
    }
  }

  _closeModal() {
    controllerLookup('application').send('closeModal');
  }

  _injectButtons($editModal) {
    if (!$('#tk-add-groups', $editModal).length) {
      $('hr', $editModal)
        .first()
        .parent()
        .after(
          $(`
        <li id="tk-add-groups">
          <button class="button-list tk-multi-groups__button">
            <svg class="qustodio-group qustodio-group-header tk-multi-groups__icon">
              <g>
                <path d="M 0,4 16,4 12,9 16,14 0,14 z"></path>
              </g>
            </svg>
            Set Group${this._checkedRows.length > 1 ? 's' : ''}
          </button>
        </li>
      `).click(this._handleAddGroups)
        );
    }

    if (!$('#tk-remove-groups', $editModal).length) {
      $('#tk-add-groups', $editModal).after(
        $(`
        <li id="tk-remove-groups">
          <button class="button-list tk-multi-groups__button ${
            !this._isAnyCheckedTransactionFlagged ? 'button-disabled' : ''
          }">
            <svg class="qustodio-group qustodio-group-none tk-multi-groups__icon">
              <g>
                <path d="M 0,4 16,4 12,9 16,14 0,14 z"></path>
              </g>
            </svg>
            Remove Group${this._checkedRows.length > 1 ? 's' : ''}
          </button>
        </li>
      `).click(this._handleRemoveGroups)
      );
    }

    if (!$('#tk-separator', $editModal).length) {
      $('#tk-remove-groups', $editModal).after($('<li id="tk-separator"><hr></li>'));
    }
  }

  _handleAddGroups = () => {
    const customColorNames = getToolkitStorageKey('groups');

    $('.modal-account-edit-transaction-list')
      .removeClass('modal-account-edit-transaction-list')
      .addClass('modal-account-groups');
    const $modalList = $('.modal-list').empty();
    GROUP_COLORS.forEach(color => {
      let colorDisplayName = color;
      if (qustodioToolKit.options.CustomGroupNames) {
        colorDisplayName = customColorNames[color.toLowerCase()].label;
      }

      $modalList.append(
        $('<li>').append(
          $('<button>', { class: `qustodio-group-${color.toLowerCase()}` })
            .click(() => this._applyColor(color))
            .append($('<div>', { class: 'label-bg', text: colorDisplayName }))
            .append($('<div>', { class: 'label', text: colorDisplayName }))
        )
      );
    });
  };

  _handleRemoveGroups = () => {
    if (!this._isAnyCheckedTransactionFlagged) {
      return this._closeModal();
    }

    this._applyColor('');
  };

  _applyColor = color => {
    const { transactionsCollection } = getEntityManager();
    getEntityManager().batchChangeProperties(() => {
      this._checkedRows.forEach(transaction => {
        const entity = transactionsCollection.findItemByEntityId(transaction.get('entityId'));
        if (entity) {
          entity.set('group', color);
        }
      });
    });

    this._closeModal();
  };
}
