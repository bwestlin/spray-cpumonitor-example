/*
 The MIT License (MIT)
 Copyright (c) 2014 Patrick Stapleton, gdi2290, PatrickJS
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

;(function(module, undefined) {
'use strict';

module.provider('WebSocket', function() {
    // when forwarding events, prefix the event name
    var _prefix = 'websocket:';
    var _WebSocket;
    var _uri;
    var _protocols;
    var _definedEvents = [];

    this.prefix = function(newPrefix) {
      _prefix = newPrefix;
      return this;
    };

    this.uri = function(uri, protocols) {
      protocols = Array.prototype.slice.call(arguments, 1);
      _uri = uri;      
      _protocols = protocols;
      _WebSocket = new WebSocket(uri, protocols);
      return this;
    };

    // expose to provider
    this.$get = ['$rootScope', '$timeout', function($rootScope, $timeout) {

      var ws = _WebSocket;

      var asyncAngularify = function (callback) {
        return function(args) {
          args = Array.prototype.slice.call(arguments);
          $timeout(function() {
            callback.apply(ws, args);
          });
        };
      };

      var addListener = function(event) {
        event = event && 'on'+event || 'onmessage';
        return function(callback) {
          ws[event] = asyncAngularify(callback);
          _definedEvents.push(event);
          return this;
        };
      };

      var wrappedWebSocket = {
        states: ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'],
        on: function(event, callback) {
          return addListener(event)(callback);
        },
        onmessage: addListener('message'),
        onclose: addListener('close'),
        onopen: addListener('open'),
        onerror: addListener('error'),
        new: function() {
          var oldws = ws;
          ws = new WebSocket(_uri, _protocols);
          //assign the old events to the new websocket
          var _len;
          for (var i = 0, _len = _definedEvents.length; i < _len; i++) {
            ws[_definedEvents[i]] = oldws[_definedEvents[i]];
          }
          return this;
        },
        close: function() {
          ws.close();
          return this
        },
        readyState: function() {
          return ws.readyState
        },
        currentState: function() {
          return this.states[ws.readyState];
        },
        send: function(message) {
          message = Array.prototype.slice.call(arguments);
          ws.send.apply(ws, message);
          return this;
        },

        removeListener: function(args) {
          args = Array.prototype.slice.call(arguments);
          ws.removeEventListener.apply(ws, args);
          return this;
        },

        // when ws.on('someEvent', fn (data) { ... }),
        // call scope.$broadcast('someEvent', data)
        forward: function(events, scope) {

          if (events instanceof Array === false) {
            events = [events];
          }

          if (!scope) {
            scope = $rootScope;
          }

          events.forEach(function(eventName) {
            var prefixedEvent = _prefix + eventName;
            var forwardEvent = asyncAngularify(function(data) {
              scope.$broadcast(prefixedEvent, data);
            });
            scope.$on('$destroy', function () {
              ws.removeEventListener(eventName, forwardEvent);
            });
            ws.onmessage(eventName, forwardEvent);
          });
          return this;

        }
      };

      return wrappedWebSocket;

    }];

});

}(angular.module('angular-websocket', [])));
