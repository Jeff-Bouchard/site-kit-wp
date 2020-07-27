<?php
/**
 * Class Google\Site_Kit\Modules\Analytics\Advanced_Tracking\Measurement_Code_Injector
 *
 * @package   Google\Site_Kit\Modules\Analytics
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Modules\Analytics\Advanced_Tracking;

use Google\Site_Kit\Modules\Analytics\Advanced_Tracking\Measurement_Events\Measurement_Event_Pipe;

/**
 * Class for injecting Javascript based on the current active plugins.
 *
 * @since n.e.x.t.
 * @access private
 * @ignore
 */
final class Measurement_Code_Injector {

	/**
	 * Holds a list of event configurations to be injected.
	 *
	 * @since n.e.x.t.
	 * @var array
	 */
	private $event_configurations;

	/**
	 * The javascript code that is injected for event tracking.
	 *
	 * @since n.e.x.t.
	 * @var string
	 */
	protected $inject_script;

	/**
	 * Injector constructor.
	 *
	 * @since n.e.x.t.
	 *
	 * @param array $event_configurations list of measurement events to track.
	 */
	public function __construct( $event_configurations ) {
		$this->event_configurations = wp_json_encode( $event_configurations );
		$this->inject_script        = <<<INJECT_SCRIPT
( function() {
	function matches( el, selector ) {
	    const matcher =
		    el.matches ||
		    el.webkitMatchesSelector ||
		    el.mozMatchesSelector ||
		    el.msMatchesSelector ||
		    el.oMatchesSelector;
	    if ( matcher ) {
	        return matcher.call( el, selector );
	    }
	    return false;
	}
    var eventConfigurations = {$this->event_configurations};
	var config;
	for ( config of eventConfigurations ) {
		const thisConfig = config;
		document.addEventListener( config.on, function( e ) {
			var el = e.target;
			if ( matches(el, thisConfig.selector) || matches(el, thisConfig.selector.concat( ' *' ) ) ) {
				var params = {};
				params['event_category'] = thisConfig.category;
				gtag( 'event', thisConfig.action, params );
			}
		}, true );
	}
	}
)();
INJECT_SCRIPT;
	}

	/**
	 * Returns the injected Javascript code.
	 *
	 * @since n.e.x.t.
	 *
	 * @return string the injected JavaScript code
	 */
	public function get_injected_script() {
		return $this->inject_script;
	}

	/**
	 * Creates list of measurement event configurations and javascript to inject.
	 *
	 * @since n.e.x.t.
	 */
	public function inject_event_tracking() {
		wp_add_inline_script( 'google_gtagjs', $this->inject_script );
	}
}
