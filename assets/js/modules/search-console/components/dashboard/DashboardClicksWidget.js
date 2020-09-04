/**
 * DashboardClicksWidget component.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME } from '../../datastore/constants';
import { STORE_NAME as CORE_SITE } from '../../../../googlesitekit/datastore/site/constants';
import { STORE_NAME as CORE_USER } from '../../../../googlesitekit/datastore/user/constants';
import { extractForSparkline, getSiteKitAdminURL } from '../../../../util';
import { trackEvent } from '../../../../util/tracking';
import { extractSearchConsoleDashboardData } from '../../util';
import whenActive from '../../../../util/when-active';
import DataBlock from '../../../../components/data-block';
import Sparkline from '../../../../components/sparkline';
import PreviewBlock from '../../../../components/preview-block';
import getDataErrorComponent from '../../../../components/notifications/data-error';
import getNoDataComponent from '../../../../components/notifications/nodata';

const { useSelect } = Data;

function DashboardClicksWidget() {
	const { data, error, loading } = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		const args = {
			dimensions: 'date',
			compareDateRanges: true,
			dateRange: select( CORE_USER ).getDateRange(),
		};

		const url = select( CORE_SITE ).getCurrentEntityURL();
		if ( url ) {
			args.url = url;
		}

		return {
			data: store.getReport( args ),
			error: store.getErrorForSelector( 'getReport', [ args ] ),
			loading: store.isResolving( 'getReport', [ args ] ),
		};
	} );

	if ( loading ) {
		return <PreviewBlock width="100%" height="202px" />;
	}

	if ( error ) {
		trackEvent( 'plugin_setup', 'search_console_error', error.message );
		return getDataErrorComponent( __( 'Search Console', 'google-site-kit' ), error.message );
	}

	if ( ! data || ! data.length ) {
		return getNoDataComponent( __( 'Search Console', 'google-site-kit' ) );
	}

	const href = getSiteKitAdminURL( 'googlesitekit-module-search-console', {} );
	const { totalClicks, totalClicksChange, dataMap } = extractSearchConsoleDashboardData( data );

	return (
		<div className="mdc-layout-grid__cell mdc-layout-grid__cell--align-bottom mdc-layout-grid__cell--span-2-phone mdc-layout-grid__cell--span-2-tablet mdc-layout-grid__cell--span-3-desktop">
			<DataBlock
				className="overview-total-clicks"
				title={ __( 'Clicks', 'google-site-kit' ) }
				datapoint={ totalClicks }
				change={ totalClicksChange }
				changeDataUnit="%"
				source={ {
					name: _x( 'Search Console', 'Service name', 'google-site-kit' ),
					link: href,
				} }
				sparkline={
					<Sparkline
						data={ extractForSparkline( dataMap, 1 ) }
						change={ totalClicksChange }
					/>
				}
			/>
		</div>
	);
}

export default whenActive( { moduleName: 'search-console' } )( DashboardClicksWidget );
