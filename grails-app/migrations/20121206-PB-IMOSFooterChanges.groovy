databaseChangeLog = {

    changeSet(author: "pmbohm (generated)", id: "1354755729622-1") {
        sql("update config set footer_content='<p>IMOS data is made freely available under the <a href=\"http://imos.org.au/fileadmin/user_upload/shared/IMOS%20General/documents/internal/IMOS_Policy_documents/Policy-Acknowledgement_of_use_of_IMOS_data_11Jun09.pdf\" title=\"Conditions of Use\" >Conditions of Use</a>. <BR/>Both IMOS data and this site are licensed under a <a class=\"external\" title=\"Creative Commons License\"  href=\"http://creativecommons.org/licenses/by/2.5/au/\" target=\"_blank\"><span >Creative Commons Attribution 2.5 Australia License</span></a> <a class=\"external\" title=\"Creative Commons License\"  href=\"http://creativecommons.org/licenses/by/2.5/au/\" target=\"_blank\"><img width=\"65\" src=\"images/by.png\"/></a></p>\n" +
                "            <p>You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it. If you have any concerns about the veracity of the data, please make enquiries via <a href=\"mailto:info@imos.org.au\">info@imos.org.au</a> to be directed to the data custodian.<br/>\n" +
                "            IMOS is supported by the Australian Government through the National Collaborative Research Infrastructure Strategy and the Super Science Initiative. It is led by the University of Tasmania on behalf of the Australian marine & climate science community.</p>'")
    }
}
