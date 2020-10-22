/**
 * User Input Help Needed Question.
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
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import UserInputQuestionWrapper from './UserInputQuestionWrapper';
import UserInputQuestionInfo from './UserInputQuestionInfo';
import UserInputSelectOptions from './UserInputSelectOptions';
import { USER_INPUT_ANSWERS_HELP_NEEDED } from './util/constants';

export default function UserInputHelpNeededQuestion( props ) {
	const maxAnswers = 3;

	return (
		<UserInputQuestionWrapper slug="helpNeeded" max={ maxAnswers } { ...props }>
			<UserInputQuestionInfo
				title={ __( 'What do you need help most with for this site?', 'google-site-kit' ) }
				questionNumber={ 4 }
			/>

			<UserInputSelectOptions
				slug="helpNeeded"
				max={ maxAnswers }
				options={ USER_INPUT_ANSWERS_HELP_NEEDED }
			/>
		</UserInputQuestionWrapper>
	);
}

UserInputHelpNeededQuestion.propTypes = {
	isActive: PropTypes.bool,
	next: PropTypes.func,
	back: PropTypes.func,
};