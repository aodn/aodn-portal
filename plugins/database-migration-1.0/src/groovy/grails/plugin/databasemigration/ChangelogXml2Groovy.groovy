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
package grails.plugin.databasemigration

/**
 * Generates a Groovy DSL version of a Liquibase XML changelog.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class ChangelogXml2Groovy {

	private static final String NEWLINE = System.getProperty('line.separator')

	/**
	 * Convert a Liquibase XML changelog to Groovy DSL format.
	 * @param xml the XML
	 * @return DSL format
	 */
	static String convert(String xml) {
		def groovy = new StringBuilder('databaseChangeLog = {')
		groovy.append NEWLINE
		for (node in new XmlParser(false, false).parseText(xml)) {
			convertNode node, groovy, 1
		}
		groovy.append '}'
		groovy.append NEWLINE
		groovy.toString()
	}

	private static void convertNode(Node node, StringBuilder groovy, int indentLevel) {

		groovy.append NEWLINE
		appendWithIndent indentLevel, groovy, node.name()

		String mixedText
		def children = []
		for (child in node.children()) {
			if (child instanceof String) {
				mixedText = child
			}
			else {
				children << child
			}
		}

		appendAttrs groovy, node, mixedText

		if (children) {
			groovy.append ' {'
			for (child in children) {
				convertNode child, groovy, indentLevel + 1
			}
			appendWithIndent indentLevel, groovy, '}'
			groovy.append NEWLINE
		}
		else {
			groovy.append NEWLINE
		}
	}

	private static void appendAttrs(StringBuilder groovy, Node node, String text) {
		def local = new StringBuilder()

		String delimiter = ''

		if (text) {
			local.append '"'
			local.append text.replaceAll('\n', '\\\\n')
			local.append '"'
			delimiter = ', '
		}

		node.attributes().each { name, value ->
			local.append delimiter
			local.append name
			local.append(': "').append(value).append('"')
			delimiter = ', '
		}

		if (local.length()) {
			groovy.append '('
			groovy.append local.toString()
			groovy.append ')'
		}
	}

	private static void appendWithIndent(int indentLevel, StringBuilder groovy, String s) {
		indentLevel.times { groovy.append '\t' }
		groovy.append s
	}
}
