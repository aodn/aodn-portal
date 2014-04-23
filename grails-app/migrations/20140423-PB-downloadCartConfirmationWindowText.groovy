/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "pmbohm (generated)", id: "1398215693687938228-1") {
        update(tableName: "config") {
            column(name: "download_cart_confirmation_window_content", value: """\
                <h3>Licence and use limitations</h3/>
                    <p>Data downloaded in a cart may include licence information or use limitations. If an agreement is included with data in the cart then by using those data you are accepting the terms of that agreement.</p>
                <h3>Any questions?</h3>
                <p>Please visit the <a href="http://emii1.its.utas.edu.au/Portal2_help/?q=node/68">Download a Dataset</a> page of the <a href="http://emii1.its.utas.edu.au/Portal2_help/">Portal Help</a> forum where you can find more information.</p>
                    <br />
                        <p class="small"><i>You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it.</i></p>""")
        }
    }
}
