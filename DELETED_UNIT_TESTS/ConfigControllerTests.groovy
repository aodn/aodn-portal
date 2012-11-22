
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal



import org.junit.*
import grails.test.mixin.*


@TestFor(ConfigController)
@Mock(Config)
class ConfigControllerTests {


    @Test
    void testIndex() {
        controller.index()
        assert "/config/list" == response.redirectedUrl
    }

    @Test
    void testList() {

        def model = controller.list()

        assert model.configInstanceList.size() == 0
        assert model.configInstanceTotal == 0

    }

    @Test
    void testCreate() {
       def model = controller.create()

       assert model.configInstance != null


    }

    @Test
    void testSave() {
        controller.save()

        assert model.configInstance != null
        assert view == '/config/create'

        // TODO: Populate valid properties

        controller.save()

        assert response.redirectedUrl == '/config/show/1'
        assert controller.flash.message != null
        assert Config.count() == 1
    }


    @Test
    void testShow() {
        controller.show()

        assert flash.message != null
        assert response.redirectedUrl == '/config/list'


        def config = new Config()

        // TODO: populate domain properties

        assert config.save() != null

        params.id = config.id

        def model = controller.show()

        assert model.configInstance == config
    }

    @Test
    void testEdit() {
        controller.edit()

        assert flash.message != null
        assert response.redirectedUrl == '/config/list'


        def config = new Config()

        // TODO: populate valid domain properties

        assert config.save() != null

        params.id = config.id

        def model = controller.edit()

        assert model.configInstance == config
    }

    @Test
    void testUpdate() {

        controller.update()

        assert flash.message != null
        assert response.redirectedUrl == '/config/list'

        response.reset()


        def config = new Config()

        // TODO: populate valid domain properties

        assert config.save() != null

        // test invalid parameters in update
        params.id = config.id

        controller.update()

        assert view == "/config/edit"
        assert model.configInstance != null

        config.clearErrors()

        // TODO: populate valid domain form parameter
        controller.update()

        assert response.redirectedUrl == "/config/show/$config.id"
        assert flash.message != null
    }

    @Test
    void testDelete() {
        controller.delete()

        assert flash.message != null
        assert response.redirectedUrl == '/config/list'

        response.reset()

        def config = new Config()

        // TODO: populate valid domain properties
        assert config.save() != null
        assert Config.count() == 1

        params.id = config.id

        controller.delete()

        assert Config.count() == 0
        assert Config.get(config.id) == null
        assert response.redirectedUrl == '/config/list'


    }


}
