package au.org.emii.portal

class LabelledContentTagLib {

    /**
     * Renders labelled content as a dt/dd pair
     *
     * @attr labelCode REQUIRED the code to use to lookup the content label
     * @attr if OPTIONAL boolean governing whether tag should be displayed
     */
    def labelledContent = { attrs, body ->
        if (!attrs.containsKey('if') || attrs['if']) {
            out << render(
                template: "/taglib/labelledContentTemplate",
                model: [ labelCode: attrs.labelCode, href: attrs.href, content: body() ]
            )
        }
    }
}
