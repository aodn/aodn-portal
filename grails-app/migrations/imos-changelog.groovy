
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    if (System.getProperty("INSTANCE_NAME") == 'IMOS') {
        // All IMOS specific change sets must appear inside this if block

        changeSet(author: "tfotak (generated)", id: "1332134693000-1", failOnError: true) {

            update(tableName: "config")
            {
                column(name:"name", value: "Integrated Marine Observing System")
                where "id = (select id from config limit 1)"
            }
        }

        changeSet(author: "tfotak (generated)", id: "1332201909000-1", failOnError: true) {

            update(tableName: "config")
            {
                column(name: "footer_content", value: '''<p>You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it. If you have any concerns about the veracity of the data, please make inquiries via <a href="mailto:info@imos.org.au">info@imos.org.au</a> to be directed to the data custodian.</p>''')
                where "id = (select id from config limit 1)"
            }
        }

        changeSet(author: "dnahodil", id: "1334124134000-2", failOnError: true) {

            update(tableName: "config")
            {
                column(name: "download_cart_filename", value: '"IMOS Portal download(%s %s).zip"')
                where "download_cart_filename LIKE '\"AODN Portal download(%s %s).zip\"'"
            }
        }

        changeSet(author: "dnahodil (generated)", id: "1334815305155-2", failOnError: true) {

            update(tableName: "config")
            {
                column(name: "download_cart_confirmation_window_content", value: """\
<table border="0" width="100%" style="font-size: 11px;">
    <tr>
        <td width="37px" valign="top"><img src="images/agreement.png" style="margin-right: 5px; margin-top: 1em;"></td>
        <td><b>Licence and use limitations</b><br/>Data downloaded in a cart may include licence information or use limitations. If an agreement is included with data in the cart then by using those data you are accepting the terms of that agreement. If no agreement is included the <a href="http://imos.org.au/fileadmin/user_upload/shared/IMOS%20General/documents/internal/IMOS_Policy_documents/Policy-Acknowledgement_of_use_of_IMOS_data_11Jun09.pdf">Acknowledgement of Use of IMOS Data</a> is applicable.</td>
    </tr>
    <tr>
        <td colspan="2">&nbsp;</td>
    </tr>
    <tr>
        <td valign="top"><img src="images/downloadTime.png" style="margin-right: 5px; margin-top: 1em;"></td>
        <td><b>Please be patient</b><br/>It can take a while to collate the data in a download cart from the various sources. Please be patient while your download cart is prepared and downloaded.</td>
    </tr>
    <tr>
        <td colspan="2">&nbsp;</td>
    </tr>
    <tr>
        <td colspan="2" style="font-size: 0.9em; font-style: italic; color: #555">You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it.</td>
    </tr>
</table>\
""")
            }
        }

        changeSet(author: "dnahodil (generated)", id: "1337127215000-1", failOnError: true) {

            update(tableName: "config") {

                column(name: "download_cart_confirmation_window_content", value: """\
<table border="0" width="100%" style="font-size: 11px;">
    <tr>
        <td width="37px" valign="top"><img src="images/agreement.png" style="margin-right: 5px; margin-top: 1em;"></td>
        <td><b>Licence and use limitations</b><br/>Data downloaded in a cart may include licence information or use limitations. If an agreement is included with data in the cart then by using those data you are accepting the terms of that agreement. If no agreement is included the <a href="http://imos.org.au/fileadmin/user_upload/shared/IMOS%20General/documents/internal/IMOS_Policy_documents/Policy-Acknowledgement_of_use_of_IMOS_data_11Jun09.pdf">Acknowledgement of Use of IMOS Data</a> is applicable.</td>
    </tr>
    <tr>
        <td colspan="2">&nbsp;</td>
    </tr>
    <tr>
        <td valign="top"><img src="images/downloadTime.png" style="margin-right: 5px; margin-top: 1em;"></td>
        <td><b>Please be patient</b><br/>It can take a while to collate the data in a download cart from the various sources. Please be patient while your download cart is prepared and downloaded.</td>
    </tr>
    <tr>
        <td colspan="2">&nbsp;</td>
    </tr>
    <tr>
        <td valign="top"><img src="images/question.png" style="margin-right: 5px; margin-top: 1em;"></td>
        <td><b>Have any questions?</b><br/>Please visit the '<a href="http://emii1.its.utas.edu.au/Portal2_help/?q=node/68">Download a Dataset</a>' page of the <a href="http://emii1.its.utas.edu.au/Portal2_help/">Portal Help</a> forum where you can find more information.</td>
    </tr>
    <tr>
        <td colspan="2">&nbsp;</td>
    </tr>
    <tr>
        <td colspan="2" style="font-size: 0.9em; font-style: italic; color: #555">You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it.</td>
    </tr>
</table>\
""")
            }
        }

        changeSet(author: "dnahodil (generated)", id: "1337313917932-2", failOnError: true) {

            update(tableName: "config") {

                column(name: "download_cart_confirmation_window_content", value: """\
<table border="0" width="100%" style="font-size: 11px;">
    <tr>
        <td width="37px" valign="top"><img src="images/agreement.png" style="margin-right: 5px; margin-top: 1em;"></td>
        <td><b>Licence and use limitations</b><br/>Data downloaded in a cart may include licence information or use limitations. If an agreement is included with data in the cart then by using those data you are accepting the terms of that agreement. If no agreement is included the <a href="http://imos.org.au/fileadmin/user_upload/shared/IMOS%20General/documents/internal/IMOS_Policy_documents/Policy-Acknowledgement_of_use_of_IMOS_data_11Jun09.pdf">Acknowledgement of Use of IMOS Data</a> is applicable.</td>
    </tr>
    <tr>
        <td colspan="2">&nbsp;</td>
    </tr>
    <tr>
        <td valign="top"><img src="images/downloadTime.png" style="margin-right: 5px; margin-top: 1em;"></td>
        <td><b>Please be patient</b><br/>It can take a while to collate the data in a download cart from the various sources. Please be patient while your download cart is prepared and downloaded.</td>
    </tr>
    <tr>
        <td colspan="2">&nbsp;</td>
    </tr>
    <tr>
        <td valign="top"><img src="images/question.png" style="margin-right: 5px; margin-top: 1em;"></td>
        <td><b>Have any questions?</b><br/>Please visit the '<a href="http://portalhelp.aodn.org.au/?q=node/68" target="_blank">Download a Dataset</a>' page of the <a href="http://portalhelp.aodn.org.au/" target="_blank">Portal Help</a> forum where you can find more information.</td>
    </tr>
    <tr>
        <td colspan="2">&nbsp;</td>
    </tr>
    <tr>
        <td colspan="2" style="font-size: 0.9em; font-style: italic; color: #555">You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it.</td>
    </tr>
</table>\
""")
            }
        }

        changeSet(author: "dnahodil (generated)", id: "1353898149000-1", failOnError: true) {

            update(tableName: "config") {

                column(name: "download_cart_confirmation_window_content", value: """\
<table border="0" width="100%" style="font-size: 11px;">
    <tr>
        <td width="37px" valign="top"><img src="images/agreement.png" style="margin-right: 5px; margin-top: 1em;"></td>
        <td><b>Licence and use limitations</b><br/>Data downloaded in a cart may include licence information or use limitations. If an agreement is included with data in the cart then by using those data you are accepting the terms of that agreement. If no agreement is included the <a href="http://imos.org.au/fileadmin/user_upload/shared/IMOS%20General/documents/internal/IMOS_Policy_documents/Policy-Acknowledgement_of_use_of_IMOS_data_11Jun09.pdf">Acknowledgement of Use of IMOS Data</a> is applicable.<br/>IMOS data is licensed under a <a href="http://creativecommons.org/licenses/by/2.5/au/" target="_blank">Creative Commons Attribution 2.5 Australia Licence<img src="images/by.png" width="80"></a></td>
    </tr>
    <tr>
        <td colspan="2">&nbsp;</td>
    </tr>
    <tr>
        <td valign="top"><img src="images/downloadTime.png" style="margin-right: 5px; margin-top: 1em;"></td>
        <td><b>Please be patient</b><br/>It can take a while to collate the data in a download cart from the various sources. Please be patient while your download cart is prepared and downloaded.</td>
    </tr>
    <tr>
        <td colspan="2">&nbsp;</td>
    </tr>
    <tr>
        <td valign="top"><img src="images/question.png" style="margin-right: 5px; margin-top: 1em;"></td>
        <td><b>Have any questions?</b><br/>Please visit the '<a href="http://portalhelp.aodn.org.au/?q=node/68" target="_blank">Download a Dataset</a>' page of the <a href="http://portalhelp.aodn.org.au/" target="_blank">Portal Help</a> forum where you can find more information.</td>
    </tr>
    <tr>
        <td colspan="2">&nbsp;</td>
    </tr>
    <tr>
        <td colspan="2" style="font-size: 0.9em; font-style: italic; color: #555">You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it.</td>
    </tr>
</table>\
""")
            }
        }

        changeSet(author: "dnahodil (generated)", id: "1353908954037-2", failOnError: true) {

            update(tableName: "config") {

                column(name: "footer_content", value: """\
<p style="margin-left: 210px;">You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it. If you have any concerns about the veracity of the data, please make enquiries via <a href="mailto:info@imos.org.au">info@imos.org.au</a> to be directed to the data custodian.</p>
<p>This site is licensed under a <a title="Creative Commons License"  href="http://creativecommons.org/licenses/by/3.0/au/" target="_blank"><span style="white-space: nowrap">Creative Commons Attribution 3.0 Australia License</span></a> <a class="external" title="Creative Commons License"  href="http://creativecommons.org/licenses/by/3.0/au/" target="_blank"><img width="80" src="images/by.png"/></a></p>
<p>IMOS data is licensed under a <a title="Creative Commons License"  href="http://creativecommons.org/licenses/by/2.5/au/" target="_blank"><span style="white-space: nowrap">Creative Commons Attribution 2.5 Australia License</span></a> <a class="external" title="Creative Commons License"  href="http://creativecommons.org/licenses/by/2.5/au/" target="_blank"><img width="80" src="images/by.png"/></a></p>""")
            }
        }

        changeSet(author: "dnahodil (generated)", id: "1353908954037-3", failOnError: true) {

            update(tableName: "config") {

                column(name: "footer_content", value: """\
<p>You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it. If you have any concerns about the veracity of the data, please make enquiries via <a href="mailto:info@imos.org.au">info@imos.org.au</a> to be directed to the data custodian.</p>
<p>This site is licensed under a <a title="Creative Commons License"  href="http://creativecommons.org/licenses/by/3.0/au/" target="_blank"><span style="white-space: nowrap">Creative Commons Attribution 3.0 Australia License</span></a> <a class="external" title="Creative Commons License"  href="http://creativecommons.org/licenses/by/3.0/au/" target="_blank"><img width="80" src="images/by.png"/></a></p>
<p>IMOS data is licensed under a <a title="Creative Commons License"  href="http://creativecommons.org/licenses/by/2.5/au/" target="_blank"><span style="white-space: nowrap">Creative Commons Attribution 2.5 Australia License</span></a> <a class="external" title="Creative Commons License"  href="http://creativecommons.org/licenses/by/2.5/au/" target="_blank"><img width="80" src="images/by.png"/></a></p>""")
            }
        }

        include file: '20121206-PB-IMOSFooterChanges.groovy'

        include file: '20130604-DN-UpdateIMOSEmailAddress.groovy'

        include file: '20140108-PB-IMOSHeaderChanges.groovy'
    }
}
