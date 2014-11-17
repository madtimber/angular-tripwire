'use strict';

angular.module('madtimber.tripwire', [])

.directive('mtTripwire', [function() {

    function link(scope, el) {

        // the last scroll point we had
        scope.lastScrollPoint = 0;

        // the current scroll point we have
        scope.currScrollPoint = el.parent()[0].scrollTop;

        // the direction the user is scrolling; -1: down, 1: up
        scope.scrollDir = -1;

        // attach the scroll handler to the parent element
        el.parent().on('scroll', function _handleScrollEvent(e) {
            // update the scroll points
            scope.lastScrollPoint = scope.currScrollPoint;
            scope.currScrollPoint = e.target.scrollTop;

            // update the scroll direction
            scope.scrollDir = (scope.currScrollPoint < scope.lastScrollPoint) ? 1 : -1;

            /**
             * Now check to see if we've tripped the wire, and if
             * we have, fire the appropriate attached event.
             *
             * There's two scenerios that we're concerned about:
             * 1. scrolling down, and tripping the wire
             * 2. scrolling up, and tripping the wire
             *
             * There can be some variance in when the browser reports a scroll
             * event, so we look at two numbers to determine if the wire was
             * tripped: the last scroll point we had, and the newly reported
             * scroll point.
             *
             * If these two numbers 'straddle' the trip point (including the
             * current point being ON the trip point), then we know that the
             * wire has been tripped.
             *
             * We also check the direction of the scrolling to appropriately
             * determine which trip handler to fire. The direction also changes
             * the math comparisons.
             */
            switch(scope.scrollDir) {
                case 1: // scrolling up
                    // check to see if the last scroll point is below the trip point
                    var lastScrollIsBelowTripPoint = scope.lastScrollPoint > scope.tripPoint;

                    // check to see if the current scroll point is at/above the trip point
                    var currScrollAtTripPoint = scope.currScrollPoint <= scope.tripPoint;

                    // if both conditions are true, than we've tripped the wire while scrolling up
                    var isTripped = lastScrollIsBelowTripPoint && currScrollAtTripPoint;

                    if(typeof scope.tripUp === 'function' && isTripped) {
                        scope.tripUp();
                    }
                    break;
                case -1: //scrolling down
                    // check to see if the last scroll point is above the trip point
                    var lastScrollIsAboveTripPoint = scope.lastScrollPoint < scope.tripPoint;

                    // check to see if the current scroll point is at/below the trip point
                    var currScrollAtTripPoint = scope.currScrollPoint >= scope.tripPoint;

                    // if both conditions are true, than we've tripped the wire while scrolling down
                    var isTripped = lastScrollIsAboveTripPoint && currScrollAtTripPoint;

                    if(typeof scope.tripDown === 'function' && isTripped) {
                        scope.tripDown();
                    }
                    break;
                default:
                    break;
            }
        });
    }

    return {
        name: 'mtTripwire',
        scope: {
            tripPoint: '=',
            tripUp: '&',
            tripDown: '&'
        },
        restrict: 'E',
        link: link
    };
}]);