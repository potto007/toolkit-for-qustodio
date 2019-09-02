(function poll() {
  if (
    qustodioToolKit.pageReady === true &&
    typeof qustodioToolKit.shared.feedChanges !== 'undefined'
  ) {
    // When this is true, the feature scripts will know they can use the mutationObserver
    qustodioToolKit.actOnChangeInit = false;

    // Set 'qustodioToolKit.debugNodes = true' to print changes the mutationObserver sees
    // during page interactions and updates to the developer tools console.
    // qustodioToolKit.debugNodes = true;
    qustodioToolKit.actOnChange = function() {
      var _MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
      var observer = new _MutationObserver(function(mutations) {
        if (qustodioToolKit.debugNodes) {
          console.log('MODIFIED NODES');
        }

        qustodioToolKit.changedNodes = new Set();

        mutations.forEach(function(mutation) {
          var newNodes = mutation.target;

          var $nodes = $(newNodes); // jQuery set
          $nodes.each(function() {
            var nodeClass = $(this).attr('class');
            if (nodeClass) qustodioToolKit.changedNodes.add(nodeClass.replace(/^ember-view /, ''));
          }); // each node mutation event
        }); // each mutation event

        if (qustodioToolKit.debugNodes) {
          console.log(qustodioToolKit.changedNodes);
          console.log('###');
        }

        // Now we are ready to feed the change digest to the
        // automatically setup feedChanges file/function
        if (qustodioToolKit.changedNodes.size > 0) {
          qustodioToolKit.shared.feedChanges({
            changedNodes: qustodioToolKit.changedNodes,
          });
        }
      });

      // This finally says 'Watch for changes' and only needs to be called the one time
      observer.observe($('.ember-view.layout')[0], {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['class'],
      });

      qustodioToolKit.actOnChangeInit = true;
    };

    // Run listeners once
    qustodioToolKit.actOnChange();
  } else if (typeof Ember !== 'undefined') {
    Ember.run.next(poll, 250);
  } else {
    setTimeout(poll, 250);
  }
})();
