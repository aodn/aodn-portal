/*
 * NonCollapsingAccordionLayout.js copied from https://www.sencha.com/forum/showthread.php?61487-Way-to-keep-at-least-one-panel-in-an-accordion-layout-always-expanded
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

// Custom accordion layout that does not allow the accordion to be fully closed.
// I.e., at least one panel must be open, and that panel cannot be explicitly closed.
Ext.ux.NonCollapsingAccordionLayout = Ext.extend( Ext.layout.Accordion, {
    animate : false,

    // A reference to the currently expanded panel that I can change without altering the this.activeItem object
    currentlyExpandedPanel : null,


    renderItem : function( c ) {
        // Call super.renderItem
        Ext.ux.NonCollapsingAccordionLayout.superclass.renderItem.apply( this, arguments );

        // If not set yet, initialize this.currentlyExpandedPanel to the first panel
        if( !this.currentlyExpandedPanel ) this.currentlyExpandedPanel = this.container.items.items[ 0 ];

        // Setup event listeners for beforeexpand and beforecollapse to run the functionality
        c.on( 'beforeexpand', this.beforeExpandPanel, this );
        c.on( 'beforecollapse', this.beforeCollapsePanel, this );
    },

    beforeExpandPanel : function( panel ) {
        var panelToCollapse = this.currentlyExpandedPanel;  // A holder for the previously selected panel
        this.currentlyExpandedPanel = panel;                // Set the new panel as the currently expanded one
        panelToCollapse.collapse();                         // Collapse the previously selected panel
        return true;
    },

    beforeCollapsePanel : function( panel ) {
        // Cancel the collapse if the panel to collapse is the currently expanded panel
        if( panel == this.currentlyExpandedPanel ) return false;
    }
});
Ext.Container.LAYOUTS[ 'nonCollapsingAccordion' ] = Ext.ux.NonCollapsingAccordionLayout;
