Ext.namespace('Portal.ui');

Portal.ui.NavigableCardLayout = Ext.extend(Ext.layout.CardLayout, {
    hasNextTab: function() {
        return this.activeItem != this.container.items.last();
    },

    hasPrevTab: function() {
        return this.activeItem != this.container.items.first();
    },

    getActiveItemIndex: function() {
        return this.container.items.findIndexBy(function(object, key) {
            return object == this.activeItem;
        }, this);
    },

    getActiveTab: function() {
        return this.activeItem;
    },

    setActiveTab: function(tabIndex) {
        if (tabIndex != this.getActiveItemIndex()) {
            this.setActiveItem(tabIndex);
            this.container._highlightActiveTab();
            this.container.fireEvent('tabchange', this.container);
        }
    },

    navigateToNextTab: function() {
        if (this.hasNextTab()) {
            this.setActiveTab(this.getActiveItemIndex() + 1);
            return true;
        }
        return false;
    },

    navigateToPrevTab: function() {
        if (this.hasPrevTab()) {
            this.setActiveTab(this.getActiveItemIndex() - 1);
            return true;
        }
        return false;
    },

    getNextNavigationLabel: function() {
        return this._getNeighbouringNavigationLabel(1, OpenLayers.i18n('navigationButtonNext', {label: "Next"}));
    },

    getPrevNavigationLabel: function() {
        return this._getNeighbouringNavigationLabel(-1, OpenLayers.i18n('navigationButtonPrevious', {label: "Previous"}));
    },

    _getNeighbouringNavigationLabel: function(relativeIndex, defaultLabel) {
        if (this._getNeighbouringItem(relativeIndex) && this._getNeighbouringItem(relativeIndex).navigationText) {
            return this._getNeighbouringItem(relativeIndex).navigationText;
        }
        else {
            return defaultLabel;
        }
    },

    _getNeighbouringItem: function(relativeIndex) {
        return this.container.items.get(this.getActiveItemIndex() + relativeIndex);
    }
});
