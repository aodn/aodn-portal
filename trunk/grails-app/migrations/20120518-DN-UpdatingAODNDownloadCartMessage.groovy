databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1337313917932-1", failOnError: true) {

        update(tableName: "config") {

            column( name: "download_cart_confirmation_window_content", value: """\
<table border="0" width="100%" style="font-size: 11px;">
    <tr>
        <td width="37px" valign="top"><img src="images/agreement.png" style="margin-right: 5px; margin-top: 1em;"></td>
        <td><b>Licence and use limitations</b><br/>Data downloaded in a cart may include licence information or use limitations. If an agreement is included with data in the cart then by using those data you are accepting the terms of that agreement.</td>
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
</table>""" )
        }
    }
}
