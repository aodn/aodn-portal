/* Copyright 2006-2010 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package grails.plugin.databasemigration.dbdoc

import liquibase.change.Change
import liquibase.database.Database

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class RecentChangesWriter extends HTMLWriter {

	RecentChangesWriter(Map files, Database database) {
		super(files, 'recent', database)
	}

	@Override
	protected String createTitle(object) { 'Recent Changes' }

	@Override
	protected void writeBody(StringBuilder content, object, List<Change> ranChanges, List<Change> changesToRun) {
		writeCustomHTML(content, object, ranChanges)
		writeChanges('Most Recent Changes', content, ranChanges, false)
	}

	@Override
	protected void writeCustomHTML(StringBuilder content, object, List<Change> changes) {
		// do nothing
	}
}
