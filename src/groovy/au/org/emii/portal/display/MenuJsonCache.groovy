package au.org.emii.portal.display

import java.security.MessageDigest;

import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class MenuJsonCache {

	static final Logger log = LoggerFactory.getLogger(MenuJsonCache.class)
	
	static MenuJsonCache _instance
	
	final def CACHE_NAME = "portalMenuJsonCache"
	def manager
	
	static synchronized MenuJsonCache instance() {
		if (!_instance) {
			_instance = new MenuJsonCache()
		}
		return _instance
	}
	
	// The private modifier doesn't actually do anything but it might send a message
	private MenuJsonCache() {
		manager = CacheManager.create()
		manager.addCache(CACHE_NAME)
		_setDynamicConfigurationParameters()
	}
	
	def add(object, menuJson) {
		def key = _toKey(object)
		log.debug("Caching JSON for object key $key")
		log.debug(menuJson)
		_getCache().put(new Element(key, menuJson));
	}
	
	def get(object) {
		def json
		def key = _toKey(object)
		def element = _getCache().get(key)
		if (element) {
			json = element.getValue()
			log.debug("Found json for object key $key")
		}
		return json
	}
	
	def clear() {
		log.debug("Clearing cache")
		_getCache().removeAll()
	}
	
	def _getCache() {
		return manager.getCache(CACHE_NAME)
	}
	
	def _toKey(object) {
		return object.getClass().getName() + "-----" + object.id
	}
	
	def _setDynamicConfigurationParameters() {
		def configuration = _getCache().getCacheConfiguration()
		// Live forever
		configuration.setTimeToLiveSeconds(0)
		// Unless idle for a day
		configuration.setTimeToIdleSeconds(86400)
	}
	
	def _dumpConfigurationStats() {
		def configuration = _getCache().getCacheConfiguration()
		log.debug(configuration.getTimeToIdleSeconds().toString())
		log.debug(configuration.getTimeToLiveSeconds().toString())
	}
}
