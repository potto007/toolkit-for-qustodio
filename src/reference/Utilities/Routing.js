///////////////////////////////////////////////////////////////////////////////
//  File:       Routing.js
//  Project:    Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2013-01-08
///////////////////////////////////////////////////////////////////////////////

QFP.Utilities.Routing = (function() {
  /**
   * Get the location hash params as key/value dictionary
   *
   * @return {Object}   Returns a js object contains each key:value hash param
   */
  function get() {
    return {
      server: QFP.Utilities.Routing.Server.get(),
      client: QFP.Utilities.Routing.Client.get(),
    };
  }

  /**
   * Generate a new location url according to a new client & server params objects.
   *
   * @param {Object} server_params The new js dictionary contains the new url ZF url params.
   * @param {Object} client_params The new js dictionary contains the new url hash params.
   * @param {Boolean} clean A flag indicationg if we want to clan old values, in other cases, its will be merged with the next ones.
   * @return {String} Returns a string value containing new location url.
   */
  function generate(server_params, client_params, clean) {
    if (client_params === true || client_params === false) {
      clean = client_params;
    }

    var current_server_url = QFP.Utilities.Routing.Server.generate(),
      new_server_url = QFP.Utilities.Routing.Server.generate(server_params, clean),
      new_client_hash = QFP.Utilities.Routing.Client.generate(
        client_params,
        server_params ? true : clean
      );

    if (new_server_url && new_client_hash) {
      return new_server_url + new_client_hash;
    } else if (new_server_url) {
      return new_server_url;
    } else if (new_client_hash) {
      return current_server_url + new_client_hash;
    } else {
      return current_server_url;
    }
  }

  /**
   * Set a new location hash generated by a new params object
   *
   * @param {Object} server_params The new js dictionary contains the new url ZF url params.
   * @param {Object} client_params The new js dictionary contains the new url hash params.
   * @param {Boolean} [clean] A flag indicationg if we want to clean current params, in other case its will be merged with the next ones.
   * @return {String} Returns a string value containing new location hash.
   */
  function set(server_params, client_params, clean) {
    var return_path = generate(server_params, client_params, clean);

    window.location.href = return_path;
    return return_path;
  }

  return {
    get: get,
    set: set,
    generate: generate,
  };
})();

QFP.Utilities.Routing.Server = (function() {
  /**
   * Get the current url path params as key/value dictionary or a specific tag value.
   *
   * @param {String} [tag_name] Optional tag name you want to get. If it's empty, all tags will be returned.
   * @return {Object|String|Undefined} If tag_name is not specified, returns a js object contains each key:value ZF url param. If tag_name is specified, return a string contain specified key. If the tag dont exists, return Undefined.
   */
  function get(tag_name) {
    var path = window.location.pathname,
      path_array = path.replace(/^\/+|\/+$/g, '').split('/'),
      params = {
        // Get ZF controller/view
        controller: path_array[0] || null,
        view: path_array[1] || null,
      };

    // Clean ZF controller/view params
    if (path_array[0]) {
      path_array.splice(0, 1);
    }
    if (path_array[0]) {
      path_array.splice(0, 1);
    }

    // Iterate for all remaining items in path_array to generate the params key/value items.
    for (var i = 0; i < path_array.length; i = i + 2) {
      var key = path_array[i],
        value = path_array[i + 1];

      if (key !== undefined && value !== undefined) {
        params[key] = value;
      }
    }

    return tag_name ? params[tag_name] : params;
  }

  /**
   * Generate a new ZF url according to a new params object
   *
   * @param {Object} new_params The new js dictionary contains the new url ZF url params.
   * @param {Boolean} [clean] A flag indicationg if we want to clean current params, in other case its will be merged with the next ones.
   * @return {String} Returns a string value containing new ZF url.
   */

  function generate(new_params, clean) {
    // get current path and create others empty vars
    var current_params = clean ? {} : get(),
      merged_params = {},
      return_path = '';

    // Join current and new params
    $.extend(merged_params, current_params, new_params);

    // Start generating final url.
    // Add controller & view to final url string;
    if (merged_params.controller) {
      return_path += '/' + merged_params.controller;
      delete merged_params.controller;
    }
    if (merged_params.view) {
      return_path += '/' + merged_params.view;
      delete merged_params.view;
    }

    // Add each of param to final url string;
    $.each(merged_params, function(key, value) {
      if (key && value) {
        return_path += '/' + key + '/' + encodeURIComponent(value);
      }
    });

    return return_path;
  }

  /**
   * Set a new url location generated by a new params object
   *
   * @param {Object} new_params The new js dictionary contains the new url ZF url params.
   * @param {Boolean} [clean] A flag indicationg if we want to clean current params, in other case its will be merged with the next ones.
   * @return {String} Returns a string value containing new ZF url.
   */
  function set(new_params, clean) {
    var return_path = generate(new_params, clean);

    window.location.href = return_path;
    return return_path;
  }

  /**
   * Clear location path
   */
  function clear() {
    window.location.href = '';
  }

  return {
    get: get,
    set: set,
    generate: generate,
    clear: clear,
  };
})();

QFP.Utilities.Routing.Client = (function() {
  /**
   * Get the location hash params as key/value dictionary or a specific string value according to passed key
   *
   * @param {String} [tag_name] Optional tag name you want to get. If it's empty, all tags will be returned.
   * @return {Object|String|Undefined} If tag_name is not specified, returns a js object contains each key:value hash param. If tag_name is specified, return a string contain specified key. If the tag dont exists, return Undefined.
   */

  function get(tag_name) {
    var hash = window.location.hash.replace(/\#/, '').replace(/^\/+|\/+$/g, ''),
      hash_array = hash.split('/'),
      params = {};

    for (var i = 0; i < hash_array.length; i = i + 2) {
      var key = hash_array[i],
        value = hash_array[i + 1];

      if (key !== undefined && value !== undefined) {
        params[key] = value;
      }
    }

    return tag_name ? params[tag_name] : params;
  }

  /**
   * Generate a new location hash according to a new params object
   *
   * @param {Object} new_params The new js dictionary contains the new url hash params.
   * @param {Boolean} [clean] A flag indicationg if we want to clean current params, in other case its will be merged with the next ones.
   * @return {String} Returns a string value containing new location hash.
   */

  function generate(new_params, clean) {
    var current_params = clean ? {} : get(),
      merged_params = {},
      return_path = '';

    $.extend(merged_params, current_params, new_params);

    $.each(merged_params, function(key, value) {
      if (key && value) {
        return_path += '/' + key + '/' + value;
      }
    });

    return_path = return_path.replace(/^\/+|\/+$/g, '');

    return return_path ? '#' + return_path : '';
  }

  /**
   * Set a new location hash generated by a new params object
   *
   * @param {Object} new_params The new js dictionary contains the new url hash params.
   * @param {Boolean} [clean] A flag indicationg if we want to clean current params, in other case its will be merged with the next ones.
   * @return {String} Returns a string value containing new location hash.
   */
  function set(new_params, append) {
    var return_path = generate(new_params, append);

    window.location.hash = return_path;
    return window.location.hash == return_path;
  }

  /**
   * Clear location hash
   */
  function clear() {
    window.location.hash = '';
  }

  return {
    get: get,
    set: set,
    generate: generate,
    clear: clear,
  };
})();
