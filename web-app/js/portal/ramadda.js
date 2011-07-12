Ext.ns('Ext.ux.state');
// dummy constructor
Ext.ux.state.TreePanel = function() {};

Ext.override(Ext.ux.state.TreePanel, {
	/**
	 * Initializes the plugin
	 * @param {Ext.tree.TreePanel} tree
	 * @private
	 */
	init:function(tree) {

		// install event handlers on TreePanel
		tree.on({
			// add path of expanded node to stateHash
			 beforeexpandnode:function(n) {
				this.stateHash[n.id] = n.getPath();
			}

			// delete path and all subpaths of collapsed node from stateHash
			,beforecollapsenode:function(n) {
				delete this.stateHash[n.id];
				var cPath = n.getPath();
				for(var p in this.stateHash) {
					if(this.stateHash.hasOwnProperty(p)) {
						if(-1 !== this.stateHash[p].indexOf(cPath)) {
							delete this.stateHash[p];
						}
					}
				}
			}
		});

		// update state on node expand or collapse
		tree.stateEvents = tree.stateEvents || [];
		tree.stateEvents.push('expandnode', 'collapsenode');

		// add state related props to the tree
		Ext.apply(tree, {
			// keeps expanded nodes paths keyed by node.ids
			 stateHash:{}

			// apply state on tree initialization
			,applyState:function(state) {
				if(state) {
					Ext.apply(this, state);

					// it is too early to expand paths here
					// so do it once on root load
					this.root.on({
						load:{single:true, scope:this, fn:function() {
							for(var p in this.stateHash) {
								if(this.stateHash.hasOwnProperty(p)) {
									this.expandPath(this.stateHash[p]);
								}
							}
						}}
					});
				}
			} // eo function applyState

			// returns stateHash for save by state manager
			,getState:function() {
				return {stateHash:this.stateHash};
			} // eo function getState
		});
	} // eo function init

}); // eo override

// eof