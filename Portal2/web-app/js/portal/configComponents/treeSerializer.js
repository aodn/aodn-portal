



/* tostring.js */

/**
* Returns a string of Json that represents the tree
* @param {Function} (optional) A function, which when passed the node, returns true or false to include
* or exclude the node.
* @param {Function} (optional) A function, which when passed an attribute name, and an attribute value,
* returns true or false to include or exclude the attribute.
* @return {String}
*/
Ext.tree.TreePanel.prototype.toJsonString = function(nodeFilter, attributeFilter, attributeMapping){
return this.getRootNode().toJsonString(nodeFilter, attributeFilter, attributeMapping);
};

/**
* Returns a string of Json that represents the node
* @param {Function} (optional) A function, which when passed the node, returns true or false to include
* or exclude the node.
* @param {Function} (optional) A function, which when passed an attribute name, and an attribute value,
* returns true or false to include or exclude the attribute.
* @return {String}
*/
Ext.tree.TreeNode.prototype.toJsonString = function(nodeFilter, attributeFilter, attributeMapping){
// Exclude nodes based on caller-supplied filtering function
if (nodeFilter && (nodeFilter(this) == false)) {
return '';
}
var c = false, result = "{";

// Add the id attribute unless the attribute filter rejects it.
if (!attributeFilter || attributeFilter("id", this.id)) {
result += '"id":' + this.id;
c = true;
}

// Add all user-added attributes unless rejected by the attributeFilter.
for(var key in this.attributes) {
    if ((key != 'id') && (!attributeFilter || attributeFilter(key, this.attributes[key]))) {
        if (c) result += ',';
        if (attributeMapping && attributeMapping[key]) {
        thisKey = attributeMapping[key];
        } else {
        thisKey = key;
        }
        // if true of false dont quote them
        if (this.attributes[key].toString() == "true" || this.attributes[key].toString()  == "false" ) {
            result += '"' + thisKey + '":' + this.attributes[key] ;
        }
        else {
            result += '"' + thisKey + '":"' + this.attributes[key] + '"';      
        }
        c = true;
    }
}

// Add child nodes if any
var children = this.childNodes;
var clen = children.length;
if(clen != 0){
    if (c) result += ',';
        result += '"children":['
    for(var i = 0; i < clen; i++){
        if (i > 0) result += ',';
        result += children[i].toJsonString(nodeFilter, attributeFilter, attributeMapping);
        }
    result += ']';
}
else {
    // if this is not a leaf give it empty children
    if (this.attributes['leaf'].toString()  == "false" ) {
        result += ',"children":[]';
    }
    
}
return result + "}";
};

/**
* Returns a string of XML that represents the tree
* @param {Function} (optional) A function, which when passed the node, returns true or false to include
* or exclude the node.
* @param {Function} (optional) A function, which when passed an attribute name, and an attribute value,
* returns true or false to include or exclude the attribute.
* @return {String}
*/
Ext.tree.TreePanel.prototype.toXmlString = function(nodeFilter, attributeFilter, attributeMapping){
return '\u003C?xml version="1.0"?>\u003Ctree>' +
this.getRootNode().toXmlString(nodeFilter, attributeFilter, attributeMapping) +
'\u003C/tree>';
};

/**
* Returns a string of XML that represents the node
* @param {Function} (optional) A function, which when passed the node, returns true or false to include
* or exclude the node.
* @param {Function} (optional) A function, which when passed an attribute name, and an attribute value,
* returns true or false to include or exclude the attribute.
* @return {String}
*/
Ext.tree.TreeNode.prototype.toXmlString = function(nodeFilter, attributeFilter, attributeMapping){
// Exclude nodes based on caller-supplied filtering function
if (nodeFilter && (nodeFilter(this) == false)) {
return '';
}
var result = '\u003Cnode';

// Add the id attribute unless the attribute filter rejects it.
if (!attributeFilter || attributeFilter("id", this.id)) {
result += ' id="' + this.id + '"';
}

// Add all user-added attributes unless rejected by the attributeFilter.
for(var key in this.attributes) {
if ((key != 'id') && (!attributeFilter || attributeFilter(key, this.attributes[key]))) {
if (attributeMapping && attributeMapping[key]) {
thisKey = attributeMapping[key];
} else {
thisKey = key;
}
result += ' ' + thisKey + '="' + this.attributes[key] + '"';
}
}

// Add child nodes if any
var children = this.childNodes;
var clen = children.length;
if(clen == 0){
result += '/>';
}else{
result += '>';
for(var i = 0; i < clen; i++){
result += children[i].toXmlString(nodeFilter, attributeFilter, attributeMapping);
}
result += '\u003C/node>';
}
return result;
};