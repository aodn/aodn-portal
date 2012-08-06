databaseChangeLog = {

    if (System.getProperty("INSTANCE_NAME") == 'IMOS') {
        // All IMOS specific change sets must appear inside this if block

        changeSet(author: "tfotak (generated)", id: "1332134693000-1", failOnError: true) {

            update(tableName: "config")
                    {
                        column(name:"name", value: "Integrated Marine Observing System")
                        where "id = 1"
                    }
        }

        changeSet(author: "tfotak (generated)", id: "1332201909000-1", failOnError: true) {

            update(tableName: "config")
                    {
                        column(name: "footer_content", value: '''<p>You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it. If you have any concerns about the veracity of the data, please make inquiries via <a href="mailto:info@imos.org.au">info@imos.org.au</a> to be directed to the data custodian.</p>''')
                        where "id = 1"
                    }
        }

        // Commented-out as this breaks with the new OpenID changes - DN
//        // Migrating users from IMOS MEST
//        changeSet(author: "dnahodil", id: "1332979683000-1", failOnError: true) {
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '173c Banksia Street, Tuart Hill', 'Australia', '20992889@student.uwa.edu.au', 'Hannipoula', 'Olsen', 'UWA', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '6060', 'WA', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Australia', 'a.jones@cqu.edu.au', 'Alison', 'Jones', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'adrian.flynn@uqconnect.edu.au', 'Adrian', 'Flynn', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Locked Bag 1370', 'Australia', 'afischer@amc.edu.au', 'Andrew', 'Fischer', 'UTAS/NCMCRS', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7277', 'TAS', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '39 Northside Drive, Hillarys', 'Australia', 'alan.pearce@fish.wa.gov.au', 'Alan', 'Pearce', 'Fisheries', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '6020', 'WA', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '13 Chauncy Crs', 'Australia', 'alessandra.mantovanelli@gmail.com', 'Alessandra', 'Mantovanelli', 'JCU', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4814', 'QLD', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'PO Box 41', 'Australia', 'alevings@hotkey.net.au', 'Andrew', 'Levings', 'CMST', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '3305', 'Vic', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'BPA5', '', 'alexandre.ganachaud@ird.fr', 'Alexandre', 'Ganachaud', 'IRD', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '98848', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Castray Esplanade', 'Australia', 'anders.goncalvesdasilva@csiro.au', 'Anders', 'Goncalves da Silva', 'CSIRO/CMAR', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7000', 'Tasmania', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'andrew.lowther@adelaide.edu.au', 'andrew', 'lowther', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'arthurb@utas.edu.au', 'Ben', 'Arthur', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'b.morris@unsw.edu.au', 'Brad', 'Morris', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'balazs@northnet.com.au', 'Balazs', 'Molnar', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'ben.howell@csiro.au', 'Ben', 'Howell', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '110B King St, Manly Vale', 'Australia', 'ben.modra@mhl.nsw.gov.au', 'Ben', 'Modra', 'Manly Hydraulics Laboratory', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '2093', 'NSW', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Castray Esplanade', 'Australia', 'bernadette.sloyan@csiro.au', 'Bernadette', 'Sloyan', 'CSIRO', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7001', 'Tasmania', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Utas', 'Australia', 'brendon.ward@csiro.au', 'Brendon', 'Ward', 'eMII', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7001', 'TAs', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'United States', 'brian@voyagergis.com', 'Brian', 'Goldin', 'VoyagerGIS', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '92373', 'california', '6');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Australia', 'brookerc@utas.edu.au', 'Clare', 'Brooker', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '26 McKenzie Street', '', 'brookk07@student.uwa.edu.au', 'Kirsty', 'Brooks', 'University of Western Australia', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '6014', 'WA', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '8 Osprey Place', 'Australia', 'bthomas@scu.edu.au', 'Bernard', 'Thomas', 'SCU', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '2478', 'NSW', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Greta Point', 'New Zealand', 'c.stevens@niwa.cri.nz', 'Craig', 'Stevens', 'NIWA', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '6022', 'NI', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Venezuela', 'Venezuela', 'cadenas.rafael@gmail.com', 'Rafael', 'Cadenas', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '3001', 'Lara', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'cherie.malone@gbrmpa.gov.au', 'Cherie', 'Malone', 'GBRMPA', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Australia', 'chloe.bibari@utas.edu.au', 'Chloe', 'Cadby-Bibari', 'IMOS/eMII', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '60 Robin St Newstead', 'Australia', 'christopher.mabin@utas.edu.au', 'Chris', 'Mabin', 'UTas-AMC NCMCRS', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7250', 'TAS', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'UniTas', 'Australia', 'craig.jones@utas.edu.au', 'Craig', 'Jones', 'eMII', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7001', 'TAS', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '3 Bullando St WARANA', 'Australia', 'cstephe1@usc.edu.au', 'Craig', 'Stephenson', 'Sustainability Research Centre, USC', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', 'Qld', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'cummig01@student.uwa.edu.au', 'Gabrielle', 'Cummins', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'cz132004@yahoo.com', 'Huy', 'Quoc', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'd.kobashi@griffith.edu.au', 'Daijiro', 'Kobashi', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Australian Antarctic Division', 'Australia', 'dave.connell@aad.gov.au', 'Dave', 'Connell', 'Australian Antarctic Division', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7050', 'Tasmania', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'GPO Box 1538', 'Australia', 'david.griffin@csiro.au', 'David', 'Griffin', 'CSIRO', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7000', 'Tas', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '134 macquarie St', 'Australia', 'david.horner@environment.tas.gov.au', 'David', 'Horner', 'EPA', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7000', 'Tasmania', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Adelaide', 'Australia', 'david.probert@smec.com', 'David', 'Probert', 'SMEC Environment', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '5000', 'SA', '7');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'davidh@uvic.ca', 'David', 'Harrison', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '1300 Redbud  Apt 176', '', 'davidlcox1949@yahoo.com', 'David', 'Cox', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '75069', 'Texas', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'dirk.slawinski@csiro.au', 'Dirk', 'Slawinski', 'CSIRO CMAR', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'dnahodil@utas.edu.au', 'David', 'Nahodil', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'dwisdom@aims.gov.au', 'Daniel', 'Wisdom', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'elisabetta.morello@csiro.au', 'Elisabetta', 'Morello', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '4/2 LogroydStreet', 'Australia', 'eraes@hotmail.com', 'Eric', 'Raes', 'UWA', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '6050', 'WA', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Castray Esplenade', 'Australia', 'erik.vanooijen@csiro.au', 'Erik', 'van Ooijen', 'CSIRO', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7000', 'TAS', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'ermoore@utas.edu.au', 'Lizzie', 'Moore', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'f.gamble@bom.gov.au', 'Felicity', 'Gamble', 'Bureau of Meteorology', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '8 Mitchell Crescent', 'Australia', 'f.jaine@uq.edu.au', 'Fabrice', 'Jaine', 'University of Queensland / CSIRO', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4183', 'QLD', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'fergus.molloy@gbrmpa.net.au', 'Fergus', 'Molloy', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'flore.blanchet@uqconnect.edu.au', 'Flore', 'Blanchet', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'France', 'florence.birol@legos.obs-mip.fr', 'Florence', 'Birol', 'LEGOS/OMP', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'florenciacp@gmail.com', 'Florencia', 'Cerutti', 'AIMS/CDU', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'CSIRO Marine & Atmospheric Research', 'Australia', 'franz.smith@csiro.au', 'Franz', 'Smith', 'CSIRO Marine & Atmospheric Research', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4163', 'Queensland', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'freund@icbm.de', 'Jan', 'Freund', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'CMAR', '', 'gary.critchley@csiro.au', 'Gary', 'Critchley', 'CMAR', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7000', 'TAS', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'gavan.thomas@gmail.com', 'Gavan', 'Thomas', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '7');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '53 St Helens Rd', 'Australia', 'gbeatty@bigpond.net.au', 'Greg', 'Beatty', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '3123', 'Vic', '6');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'geoff@geoffwilliams.me.uk', 'Geoff', 'Williams', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'gerry.ryder@csiro.au', 'Ryder', 'Gerry', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '8 Kantara Ct', 'Australia', 'gjcoombes@gmail.com', 'Gavin', 'Coombes', 'JCU', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4812', 'Qld', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'IMAS, U. Tas.', 'Albania', 'h.e.phillips@utas.edu.au', 'Helen', 'Phillips', 'IMAS', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7005', 'Tasmania', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '90 South St Murdoch', 'Australia', 'h.kobryn@murdoch.edu.au', 'Halina', 'Kobryn', 'Murdoch University', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '6150', 'WA', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'h.tonin@aims.gov.au', 'Hemerson', 'Tonin', 'AIMS', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'heyw@lreis.ac.cn', 'he', 'yawen', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'horsewan@hotmail.com', 'Zhibo', 'Wan', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'ian.barton@csiro.au', 'Ian', 'Barton', 'CSIRO MAR', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '233 middle St Cleveland', 'Australia', 'ian.mcleod@csiro.au', 'Ian', 'McLeod', 'CSIRO_MAR', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4163', 'qld', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '32 peel street', 'Great Britain (UK)', 'j.cooper@liv.ac.uk', 'Jennifer', 'Cooper', 'The University of liverpool', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', 'L8 3SZ', 'Liverpool', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'PMB 3, Townsville MC', 'Australia', 'j.doyle@aims.gov.au', 'Jason', 'Doyle', 'AIMS', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4810', 'QLD', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'j.humphries@student.unsw.edu.au', 'Josh', 'Humphries', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'School of ITEE, UQ', 'Australia', 'j.hunter@uq.edu.au', 'Jane', 'Hunter', 'School of ITEE', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4072', 'Qld', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'South Street', 'Australia', 'j.verduin@murdoch.edu.au', 'Jennifer', 'Verduin', 'Enivronmental Science', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '6150', 'WA', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'j.zier@griffith.edu.au', 'Baly', 'Zier', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Utas', 'Australia', 'jacqui.hope@utas.edu.au', 'Jacqui', 'Hope', 'eMII', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7001', 'TAS', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'CS Christian Laboratory, Clunies Ross St, Acton', 'Australia', 'janet.anstee@csiro.au', 'Janet', 'Anstee', 'CSIRO Land and Water', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '2601', 'ACT', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'jasmine.jaffres@jcu.edu.au', 'Jasmine', 'Jaffres', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'jeanette.osullivan@csiro.au', 'Jeanette', 'O''Sullivan', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'CSIRO Marine Laboratories, Castray Esplanade, Battery Point', 'Australia', 'jim.mansbridge@csiro.au', 'Jim', 'Mansbridge', 'CSIRO', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7004', 'Tasmania', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'jkburges@utas.edu.au', 'Jon', 'Burgess', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'john@thornborough.com.au', 'John', 'Thornborough', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', 'NSW', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'joseph.adelstein@csiro.au', 'Joe', 'Adelstein', 'CSIRO', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Brazil', 'josse.silva@yahoo.com.br', 'Josse', 'Silva', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'brisbane', 'Australia', 'juana.alian@gmail.com', 'Juana', 'Gao', 'university of Queensland', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4067', 'queensland', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'kalair.conaghan@gbrmpa.gov.au', 'Kalair', 'Conaghan', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Private Bag 21', 'Australia', 'kate.reid@utas.edu.au', 'Kate', 'Reid', 'eMII', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7001', 'Tasmania', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'c/- eMII Office, University of Tasmania', 'Australia', 'kate.roberts@utas.edu.au', 'Kate', 'Roberts', 'eMII, IMOS', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7001', 'TAS', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'uats-bnpo', 'Australia', 'katherine.ocnnor@utas.edu.au', 'Katherine', 'O''Connor', 'BlueNet', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7001', 'tas', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'katherine.tattersall@utas.edu.au', 'Katherine', 'Tattersall', 'eMII', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'kathryn.audroing@gmail.com', 'Kathryn', 'Audroing', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Garduate school of Environment', 'Australia', 'kathryn.lee@mq.edu.au', 'Kathryn', 'Lee', 'macquarie University', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '2109', 'New South Wales', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'The University of Queensland', 'Australia', 'kathy.townsend@uq.edu.au', 'Kathy', 'Townsend', 'School of Biological Sciences', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4072', 'Queensland', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Netherlands', 'katja.philippart@nioz.nl', 'Katja', 'Philippart', 'Royal NIOZ', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '1790 AB', 'NH', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'University of Tasmania', 'Australia', 'katy.hill@imos.org.au', 'Katy', 'Hill', 'IMOS', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7001', 'Tasmania', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Rendal', 'India', 'kkcnkc@gmail.com', 'Kailas', 'Chougule', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '416203', 'Maharashtra', '7');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'kristina.paterson@csiro.au', 'Kristina', 'Paterson', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'kylie.pepper@utas.edu.au', 'Kylie', 'Pepper', 'eMII', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '700 Collins St, docklands', 'Australia', 'l.krummel@bom.gov.au', 'Lisa', 'Krummel', 'bureau of meteorology', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '3008', 'Vic', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'laurent.besnard@utas.edu.au', 'Laurent', 'Besnard', 'emii', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'lmarcus@utas.edu.au', 'Lara', 'Marcus', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'lucaskoleits@gmail.com', 'Lucas', 'Koleits', 'University of Tasmania', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Australia', 'luke@ivec.org', 'Luke', 'Edwards', 'IVEC', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'mal.heron@ieee.org', 'Mal', 'Heron', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'maria.zann@uqconnect.edu.au', 'Maria', 'Zann', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Private Bag 110', 'Australia', 'marian.mcgowen@utas.edu.au', 'Marian', 'McGowen', 'IMOS, University of Tasmania', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7001', 'Tasmania', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'marie.sinoir@csiro.au', 'Marie', 'Sinoir', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'UTS', 'Australia', 'mark.baird@uts.edu.au', 'Mark', 'Baird', 'C3', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '2007', 'NSW', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'martina.doblin@uts.edu.au', 'Martina', 'Doblin', 'University of Technology, Sydney', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Hobart', 'Australia', 'marty.hidas@utas.edu.au', 'Marty', 'Hidas', 'IMOS/eMII', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7001', 'Tas', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'mathias.luecker@bsh.de', 'Mathias', 'Luecker', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'France', 'mathilde.cancet@noveltis.fr', 'Mathilde', 'Cancet', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Spain', 'matiasbonet@gmail.com', 'Matias', 'Bonet', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'United States', 'maucarranza@ucsd.edu', 'Magdalena', 'Carranza', 'Scripps Institution of Oceanography - UCSD', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Ecuador', 'mauri_orozco@hotmail.com', 'Mauricio', 'Orozco', 'DemaDev Informatics', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '117 Main South Road Huntfield Heights', 'Australia', 'mhernen@optusnet.com.au', 'Martin', 'Hernen', 'South Australian Aquaculture Council', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '5163', 'South Australia', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '67 Odenpa Road', '', 'mic592@uow.edu.au', 'Matthew', 'Cole', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '2526', 'nsw', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '168 St Georges Terrace', 'Australia', 'michelle.swann@epa.wa.gov.au', 'Michelle', 'Swann', 'Office of the Environmental Protection Authority', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '6000', 'WA', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'modernwc@westnet.com.au', 'Mark', 'Harrison', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '7 Mommtaz nassarst.into el-adlt st', 'Egypt', 'mohamed_hashem60@yahoo.com', 'Mohammed Mostafa', 'Hashem', 'GIS', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '71111', 'Assiut', '7');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '2/82 Queen St Berry', 'Australia', 'mrmarlin@optusnet.com.au', 'Ian', 'Fox', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '2535', 'NSW', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'natalia.atkins@utas.edu.au', 'Natalia', 'Atkins', 'eMII', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'nhbahmad@utas.edu.au', 'Nurul', 'Ahmad', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Australia', 'nma5@postoffice.utas.edu.au', 'Nicholas', 'Alexander', 'University of Tasmania', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'npremrudee@gmail.com', 'Premrudee', 'Noonsang', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'nugzar.margvelashvili@csiro.au', 'Nugzar', 'Margvelashvili', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '300 Sandy bay Rd', 'Australia', 'oceans@iprimus.com.au', 'Angus', 'McEwan', 'retired', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7005', 'Tasmania', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Australia', 'odaniel@utas.edu.au', 'Owen', 'Daniel', 'imas', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'p.bell@uq.edu.au', 'Peter', 'Bell', 'university of queensland', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'paola.rachellodolmen@uqconnect.edu.au', 'Paola', 'Rachello', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '13/42 Perkins st', 'Australia', 'paulina.cetinaheredia@jcu.edu.au', 'Paulina', 'Cetina', 'JCU', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4810', 'Queensland', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Australia', 'penny.lyle@utas.edu.au', 'Penny', 'Lyle', 'eMII', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'peter.blain@utas.edu.au', 'Peter', 'Blain', 'eMII', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Castray Esp', 'Australia', 'peter.jansen@csiro.au', 'Peter', 'Jansen', 'CSIRO/UTAS', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7001', 'TAS', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'peter.oke@csiro.au', 'Peter', 'Oke', 'CSIRO', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Australia', 'phil.pedersen@gmail.com', 'Philip', 'Pedersen', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '5108', 'south australia', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Castray Esplanade', 'Australia', 'philip.gillibrand@csiro.au', 'Philip', 'Gillibrand', 'CMAR', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7000', 'TAS', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'James Cook University', 'Australia', 'philip.munday@jcu.edu.au', 'Philip', 'Munday', 'James Cook University', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4811', 'QLD', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'pmak@utas.edu.au', 'Pauline', 'Mak', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'pmbohm@utas.edu.au', 'Philip', 'Bohm', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '112 York St Bedford', 'Australia', 'poison_pen@hotmail.com', 'Anton', 'Kuret', 'UWA', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '6052', 'WA', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '7/145 Central Avenue, Indooroopilly', 'Australia', 'r.borregoacevedo@uq.edu.au', 'Rodney', 'Borrego', 'University of Queensland', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4068', 'QLD', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'School of GPEM, University of Queensland, St Lucia', 'Australia', 'r.johnstone@uq.edu.au', 'Ron', 'Johnstone', 'Geography, Planning, Environmental Management, University of Queensland', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4072', 'Queensland', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'robert.davy@csiro.au', 'Robert', 'Davy', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'GSE, Macquarie University', 'Australia', 'robert.harcourt@mq.edu.au', 'Rob', 'Harcourt', 'Macquarie University', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '2109', 'NSW', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'robertj1@utas.edu.au', 'Robert', 'Johnson', 'University of Tasmania, IMAS', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'roger.proctor@utas.edu.au', 'Roger', 'Proctor', 'emii', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Castray Ave Hobart', 'Australia', 'ryan.downie@csiro.au', 'Ryan', 'Downie', 'CSIRO CMAR', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7000', 'TAS', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Australia', 's.pausina@uq.edu.au', 'Sarah', 'Pausina', 'CSIRO & UQ', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4101', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Heron Island Research Station', 'Australia', 'scientific.hirs@uq.edu.au', 'Elizabeth', 'Perkins', 'University of Queensland', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4680', 'Qld', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'scottfj@utas.edu.au', 'Fiona', 'Scott', 'University of Tasmania / IMAS', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'sebastien.mancini@utas.edu.au', 'Sebastien', 'Mancini', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'sharon.hu@transport.wa.gov.au', 'Sharon', 'Hu', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'simon.allen@imos.org.au', 'Simon', 'Allen', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'sjpayne@utas.edu.au', 'Sarah', 'Payne', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'skim@coas.oregonstate.edu', 'Sangil', 'Kim', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'smguru@gmail.com', 'Siddeswara', 'Guru', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Australia', 'steg64@hotmail.com', 'Phil', 'Gallastegui', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Utas', 'Australia', 'stephen.cameron@utas.edu.au', 'Stephen', 'Cameron', 'emii', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7001', 'TAS', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'steven.edgar@csiro.au', 'Steven', 'Edgar', 'csiro-cmar', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'sven.rehder@jcu.edu.au', 'Sven', 'Rehder', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 't.rogers@unsw.edu.au', 'Tracey', 'Rogers', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'tedesj01@student.uwa.edu.au', 'Jamie', 'Tedeschi', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '12 Davey Crt New Norfolk', 'Australia', 'terabarb@bigpond.net.au', 'Terry', 'Hanlon', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7140', 'Tas', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'IISc , Bangalore', '', 'thushara@caos.iisc.ernet.in', 'thushara', 'Venugopal', 'IISc', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '560012', 'bangalore', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'IISC', '', 'thusharagopal@gmail.com', 'Thushara', 'Gopal', 'iisc', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '560012', 'bangalore', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'IMSO Office', 'Australia', 'tim.moltmann@imos.org.au', 'Tim', 'Moltmann', 'IMOS', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '7000', 'Tas', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '17 Forest Avenue, Black Forest', 'Australia', 'timothy.luke@catalystenergy.com.au', 'Timothy', 'Luke', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '5035', 'SA', '6');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'tjikaljedy@gmail.com', 'Tjikal', 'Jedy', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', null);"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'todd.baker@dpipwe.tas.gov.au', 'Todd', 'Baker', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '55 mearns st', 'Australia', 'tracsoc@gmail.com', 'Brendan', 'Trewin', 'Tracking Research for Animal Conservation Society', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '4103', 'queensland', '4');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', 'Ha Noi', 'Viet Nam', 'trandunga3k50@gmail.com', 'Dung', 'Tran', 'IT', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'ultimatetimber@yahoo.com.au', 'Mathew', 'Buxcey', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Australia', 'vand0267@flinders.edu.au', 'Virginie', 'van Dongen Vogels', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', 'SA', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'veronique.hiriartbaer@gmail.com', 'Veronique', 'Hiriart-Baer', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Argentina', 'vito3@fibertel.com.ar', 'Silvia', 'Bardelli', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '7');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'wayne.sumpton@deedi.qld.gov.au', 'Wayne', 'Sumpton', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '2');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '29 Baillie Dr Port Lincoln', 'Australia', 'wrongnumber@skymesh.com.au', 'Geoff', 'Carpenter', 'CFS', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '5606', 'South Australia', '8');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', 'Australia', 'y.sun@adfa.edu.au', 'Younjong', 'Sun', '', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '2600', 'ACT', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//
//            sql "INSERT INTO portal_user(id, \"version\", address, country, email_address, first_name, last_name, organisation, password_salt, password_hash, postcode, state, org_type_id) VALUES ((select nextval('hibernate_sequence')), '0', '', '', 'zdlin@mail.iap.ac.cn', 'zhongda', 'lin', 'IAP, CAS, PR China', 'zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=', 'NotARealPasswordDigestUserWillNeedToResetTheirPassword', '', '', '5');"
//            sql "INSERT INTO portal_user_roles(user_id, user_role_id) VALUES ((select currval('hibernate_sequence')), '13');"
//        }

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
    }
}