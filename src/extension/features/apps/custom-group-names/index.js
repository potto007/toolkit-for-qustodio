import { Feature } from 'toolkit/extension/features/feature';
import { getToolkitStorageKey, setToolkitStorageKey } from 'toolkit/extension/utils/toolkit';
import { isCurrentRouteAppsPage } from 'toolkit/extension/utils/qustodio';
import { controllerLookup } from 'toolkit/extension/utils/ember';

let groups;
let redGroupLabel;
let blueGroupLabel;
let orangeGroupLabel;
let yellowGroupLabel;
let greenGroupLabel;
let purpleGroupLabel;

export class CustomGroupNames extends Feature {
  constructor() {
    super();
    if (!getToolkitStorageKey('groups')) {
      this.storeDefaultGroups();
    }
    if (typeof groups === 'undefined') {
      groups = getToolkitStorageKey('groups');
      this.updateGroupLabels();
    }
  }

  shouldInvoke() {
    return isCurrentRouteAccountsPage();
  }

  invoke() {
    $('.qustodio-grid-cell-group .qustodio-group-red')
      .parent()
      .attr('title', redGroupLabel);
    $('.qustodio-grid-cell-group .qustodio-group-blue')
      .parent()
      .attr('title', blueGroupLabel);
    $('.qustodio-grid-cell-group .qustodio-group-orange')
      .parent()
      .attr('title', orangeGroupLabel);
    $('.qustodio-grid-cell-group .qustodio-group-yellow')
      .parent()
      .attr('title', yellowGroupLabel);
    $('.qustodio-grid-cell-group .qustodio-group-green')
      .parent()
      .attr('title', greenGroupLabel);
    $('.qustodio-grid-cell-group .qustodio-group-purple')
      .parent()
      .attr('title', purpleGroupLabel);
  }

  observe(changedNodes) {
    if (!this.shouldInvoke()) return;

    if (changedNodes.has('layout user-logged-in') || changedNodes.has('qustodio-grid-body')) {
      this.invoke();
    }

    if (
      changedNodes.has(
        'qustodio-u modal-popup modal-account-groups ember-view modal-overlay active'
      )
    ) {
      $('.qustodio-group-red .label, .qustodio-group-red .label-bg').text(redGroupLabel);
      $('.qustodio-group-blue .label, .qustodio-group-blue .label-bg').text(blueGroupLabel);
      $('.qustodio-group-orange .label, .qustodio-group-orange .label-bg').text(orangeGroupLabel);
      $('.qustodio-group-yellow .label, .qustodio-group-yellow .label-bg').text(yellowGroupLabel);
      $('.qustodio-group-green .label, .qustodio-group-green .label-bg').text(greenGroupLabel);
      $('.qustodio-group-purple .label, .qustodio-group-purple .label-bg').text(purpleGroupLabel);

      $('.modal-account-groups .modal')
        .css({ height: '22em' })
        .append(
          $('<div>', { id: 'account-groups-actions' })
            .css({ padding: '0 .3em' })
            .append(
              $('<button>', {
                id: 'groups-edit',
                class: 'button button-primary',
              })
                .append('Edit Group Names ')
                .append($('<i>', { class: 'flaticon stroke compose-3' }))
            )
        );

      this.addEventListeners();
    }
  }

  onRouteChanged() {
    if (!this.shouldInvoke()) return;

    this.invoke();
  }

  addEventListeners() {
    let $this = this;
    $('#groups-edit').click(function() {
      $('.modal-account-groups .modal-list').empty();

      for (let key in groups) {
        let group = groups[key];

        $('.modal-account-groups .modal-list').append(
          $('<li>').append(
            $('<input>', {
              id: key,
              type: 'text',
              class: 'group-input',
              value: group.label,
              placeholder: group.label,
            }).css({
              color: '#fff',
              fill: group.color,
              'background-color': group.color,
              height: 30,
              padding: '0 .7em',
              'margin-bottom': '.3em',
              border: 'none',
            })
          )
        );
      }

      $('#account-groups-actions').empty();

      $('#account-groups-actions').append(
        $('<button>', {
          id: 'groups-close',
          class: 'button button-primary',
        })
          .append('Ok ')
          .append(
            $('<i>', {
              class: 'flaticon stroke checkmark-2',
            })
          )
      );

      $('input.group-input').focus(function() {
        $(this).css({
          color: '#000',
        });
      });

      $('input.group-input').blur(function() {
        $(this).css({
          color: '#fff',
        });
        $this.saveGroup($(this));
      });

      $('#groups-close').click(function() {
        controllerLookup('application').send('closeModal');
      });
    });
  }

  saveGroup(group) {
    if (group.attr('placeholder') !== group.val()) {
      let key = group.attr('id');

      groups[key].label = group.val();
      setToolkitStorageKey('groups', groups);

      this.updateGroupLabels();
      this.invoke();
    }
  }

  updateGroupLabels() {
    redGroupLabel = groups.red.label;
    blueGroupLabel = groups.blue.label;
    orangeGroupLabel = groups.orange.label;
    yellowGroupLabel = groups.yellow.label;
    greenGroupLabel = groups.green.label;
    purpleGroupLabel = groups.purple.label;
  }

  storeDefaultGroups() {
    const groupsJSON = {
      red: {
        label: 'Red',
        color: '#d43d2e',
      },
      orange: {
        label: 'Orange',
        color: '#ff7b00',
      },
      yellow: {
        label: 'Yellow',
        color: '#f8e136',
      },
      green: {
        label: 'Green',
        color: '#9ac234',
      },
      blue: {
        label: 'Blue',
        color: '#0082cb',
      },
      purple: {
        label: 'Purple',
        color: '#9384b7',
      },
    };

    setToolkitStorageKey('groups', groupsJSON);
  }
}
