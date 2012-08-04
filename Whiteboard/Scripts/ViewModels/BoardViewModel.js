﻿(function($, ko, window, undefined) {
    var ViewModels = (window.ViewModels = window.ViewModels || {});
    ViewModels.BoardViewModel = function (hub, boardData, canvas) {
        if (!boardData) throw "Board data must be specified";
        if (!canvas) throw "Canvas view model is required";

        var
            //board name
            _name = ko.observable(boardData.Name),
            _hasSavedName = ko.observable(false),
            _saveName = ko.command(function () {
                _hasSavedName(true);
                return hub.renameBoard(boardData.Id, _name());
            }),

            ///clear board
            _clearBoard = ko.command(function () {
                return hub.clearBoard(boardData.Id);
            })
            .done(function () {
                canvas.artifacts.removeAll();
            });

            //events
            _events = ko.observableArray(),
            _newEvents = ko.observable(0),
            _clearNewEvents = function () {
                _newEvents(0);
            },
             
            //populate the initial events
            _populateEventsFromInitialData = function() {
                var eventVms = [];
                for (var i = 0; i < boardData.BoardEvents.length; i++) {
                    eventVms.push(ko.mapping.fromJS(boardData.BoardEvents[i]));
                }
                _events(eventVms);
            },

            //populate the initial artifacts
            _populateArtifactsFromInitialData = function() {
                var artifactVms = [];
                for (var i = 0; i < boardData.Artifacts.length; i++) {
                    artifactVms.push(new ViewModels.ArtifactViewModel(boardData.Artifacts[i]));
                }
                canvas.artifacts(artifactVms);
            },

            //update the event list with a new server event
            _recordEvent = function (event) {
                _events.unshift(ko.mapping.fromJS(event));
                _newEvents(_newEvents() + 1);
            },

            //hook up signalr event listeners
            _hookUpServerEventListeners = function () {

                //react to board being renamed
                hub.boardRenamed = function (newName, event) {
                    _name(newName);
                    _recordEvent(event);
                };

                //artifact being added
                hub.artifactAdded = function (artifact, event) {
                    canvas.artifacts.push(new ViewModels.ArtifactViewModel(artifact));
                    _recordEvent(event);
                };

                //board being cleared
                hub.boardCleared = function (event) {
                    canvas.artifacts.removeAll();
                    _recordEvent(event);
                };
            },
            
            //called during construction
            _init = function () {
                _populateEventsFromInitialData();
                _populateArtifactsFromInitialData();

                _hookUpServerEventListeners();
                

                //save the name when it is updated
                _name.subscribe(function () {
                    _saveName();
                });

                //save any artifact added to the canvas
                canvas.artifactAdded.subscribe(function(added) {
                    added.save(hub, boardData.Id);
                });
            },
            
            //called once the hub is up and running
            _onHubStarted = function () {
                hub.join(boardData.Id);
            };

        _init();

        //public members
        this.name = _name;
        this.saveName = _saveName;
        this.hasSavedName = _hasSavedName;
        this.events = _events;
        this.onHubStarted = _onHubStarted;
        this.newEvents = _newEvents;
        this.clearNewEvents = _clearNewEvents;
        this.clearBoard = _clearBoard;
        this.canvas = canvas;
    };

})(jQuery, ko, window);